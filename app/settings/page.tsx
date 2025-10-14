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

    return (
        <main aria-label="Settings" className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <div className="text-sm text-gray-700">
                Settings now live under <a className="text-blue-600 hover:underline" href="/account">Account</a>.
            </div>
            <div>
                <a className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white text-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" href="/account">
                    Go to Account
                </a>
            </div>
        </main>
    );
}
