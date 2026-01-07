import React from 'react';
import { SignInPanel } from '@/components/SignInPanel';
import { ContextCard } from '@/components/dev-tools/ContextCard';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { Button } from "@/components/ui/button"

export const metadata = {
    title: 'Sign in',
    description: 'Authenticate to access your dashboard and account.'
};

export default async function AuthPage() {
    // Detect existing session on the server; if authenticated, don't show the sign-in form
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        // Outside of a Next request context (e.g., tests), provide a minimal headers shim
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);

    if (state.authenticated) {
        return (
            <main aria-label="Auth" className="max-w-md mx-auto p-6 space-y-4" data-auth-state="signed-in">
                <h1 className="text-lg font-semibold">You’re already signed in</h1>
                <p className="text-sm text-muted-foreground">
                    {state.rawSession?.email ? (
                        <>Signed in as <span className="font-medium text-foreground">{state.rawSession.email}</span>.</>
                    ) : (
                        <>You’re signed in and don’t need to authenticate again.</>
                    )}
                </p>
                <div>
                    <Button asChild>
                        <a href="/dashboard">Go to dashboard</a>
                    </Button>
                </div>
            </main>
        );
    }

    const enableGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div className="max-w-md mx-auto p-6 space-y-4" data-auth-state="signed-out">
            <h1 className="text-lg font-semibold">Sign in</h1>
            <p className="text-sm text-muted-foreground">Access the dashboard after authenticating.</p>
            <SignInPanel enableGoogle={enableGoogle} />
            {isDev && (
                <div className="pt-8 border-t mt-8">
                    <ContextCard
                        title="Auth Configuration Context"
                        description="Authentication uses NextAuth.js (Auth.js) Credentials provider. Database sessions strategy."
                        prompt="Analyze `lib/auth/nextauth-options.ts` and `app/api/auth/[...nextauth]/route.ts`. Explain how to add a Google Provider."
                        fileLocation="lib/auth/"
                    />
                </div>
            )}
        </div>
    );
}
