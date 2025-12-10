import React from 'react';
import { SignInPanel } from '@/components/SignInPanel';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';

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
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {state.rawSession?.email ? (
                        <>Signed in as <span className="font-medium">{state.rawSession.email}</span>.</>
                    ) : (
                        <>You’re signed in and don’t need to authenticate again.</>
                    )}
                </p>
                <div>
                    <a
                        className="inline-block px-3 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700 focus-ring"
                        href="/dashboard"
                    >
                        Go to dashboard
                    </a>
                </div>
            </main>
        );
    }

    const enableGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    return (
        <div className="max-w-md mx-auto p-6 space-y-4" data-auth-state="signed-out">
            <h1 className="text-lg font-semibold">Sign in</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Access the dashboard after authenticating.</p>
            <SignInPanel enableGoogle={enableGoogle} />
        </div>
    );
}
