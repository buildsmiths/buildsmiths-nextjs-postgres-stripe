'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

// AuthButton: now only renders Sign out when signed-in, else a Sign in link to /auth

interface AuthButtonProps {
    initialUserId?: string | null;
    onChange?(userId: string | null): void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ initialUserId = null, onChange }) => {
    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(initialUserId);
    const [loading, setLoading] = useState<boolean>(false);
    const signedIn = !!userId;

    useEffect(() => {
        const id = (session?.user as any)?.id ?? null;
        setUserId(id);
        onChange?.(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]);

    async function handleSignOut() {
        setLoading(true);
        try {
            await nextAuthSignOut({ redirect: false });
            // Immediately reflect signed-out state in UI without waiting for auth event
            setUserId(null);
            onChange?.(null);
        } finally {
            setLoading(false);
        }
    }

    if (signedIn) {
        return (
            <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-gray-700 text-white text-sm hover:bg-gray-600 transition focus-ring"
                data-auth-state="signed-in"
                disabled={loading}
            >
                {loading ? 'Signing out…' : 'Sign out'}
            </button>
        );
    }

    // Signed-out: show a single Sign in link to dedicated page
    return (
        <a
            href="/auth"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition focus-ring"
            data-auth-state="signed-out-link"
        >
            Sign in
        </a>
    );
};

// Helper exported for testability and reuse
export function buildRedirectUrl(): string | undefined {
    const base =
        (typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_SITE_URL
            : window.location.origin) || undefined;
    return base ? `${base}/auth/callback` : undefined;
}
