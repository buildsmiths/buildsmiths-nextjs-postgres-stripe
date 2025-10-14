import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '../../lib/access/subscriptionState';
import SignedOutPrompt from '../../components/SignedOutPrompt';

export default async function SettingsPage() {
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);

    if (!state.authenticated) return <SignedOutPrompt ariaLabel="Settings" />;

    const userId = (state.rawSession as any)?.userId ?? null;
    const email = (state.rawSession as any)?.email ?? null;

    return (
        <main aria-label="Settings" className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <section aria-label="Profile" className="space-y-2">
                <h2 className="text-xl font-medium">Profile</h2>
                {state.authenticated ? (
                    <p className="text-sm text-gray-700">Signed in as <code>{email ?? userId}</code></p>
                ) : (
                    <p className="text-sm text-gray-700">You are not signed in.</p>
                )}
            </section>

            <section aria-label="Preferences" className="space-y-2">
                <h2 className="text-xl font-medium">Preferences</h2>
                <p className="text-sm text-gray-700">Coming soon.</p>
            </section>
        </main>
    );
}
