'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// AuthButton: now only renders Sign out when signed-in, else a Sign in link to /auth

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
            <button
                type="button"
                onClick={handleSignOut}
                className={cn(buttonVariants({ variant, size, className }))}
                data-auth-state="signed-in"
                disabled={loading}
                {...props}
            >
                {loading ? 'Signing out…' : 'Sign out'}
            </button>
        );
    }

    // Signed-out: show a single Sign in link to dedicated page
    return (
        <a
            href="/auth"
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
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
