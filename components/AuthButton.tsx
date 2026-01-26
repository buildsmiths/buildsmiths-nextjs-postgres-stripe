'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { Button, type ButtonProps } from '@/components/ui/button';

// AuthButton: now only renders Sign out when signed-in, else a Sign in link to /auth

interface AuthButtonProps extends ButtonProps {
    initialUserId?: string | null;
    onUserChange?(userId: string | null): void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ initialUserId = null, onUserChange, className, variant, size, ...props }) => {
    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(initialUserId);
    const [loading, setLoading] = useState<boolean>(false);
    const signedIn = !!userId;

    useEffect(() => {
        const id = (session?.user as any)?.id ?? null;
        setUserId(id);
        onUserChange?.(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user]);

    async function handleSignOut() {
        setLoading(true);
        try {
            await nextAuthSignOut({ redirect: false });
            // Immediately reflect signed-out state in UI without waiting for auth event
            setUserId(null);
            onUserChange?.(null);
        } finally {
            setLoading(false);
        }
    }

    if (signedIn) {
        return (
            <Button
                type="button"
                onClick={handleSignOut}
                className={className}
                variant={variant}
                size={size}
                data-auth-state="signed-in"
                disabled={loading}
                {...props}
            >
                {loading ? 'Signing out…' : 'Sign out'}
            </Button>
        );
    }

    // Signed-out: show a single Sign in link to dedicated page
    return (
        <Button asChild variant="default" size="default">
            <a
                href="/auth"
                data-auth-state="signed-out-link"
            >
                Sign in
            </a>
        </Button>
    );
};

// Helper exported for testability and reuse
export function buildRedirectUrl(): string | undefined {
    let base =
        (typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_SITE_URL
            : window.location.origin) || undefined;

    // Fix: If 'base' is accidentally set to the string "base" or similar invalid URL in .env, fallback to null
    if (base && !base.startsWith('http')) {
        base = undefined;
    }

    return base ? `${base}/auth/callback` : undefined;
}
