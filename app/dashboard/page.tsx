import { deriveSubscriptionStateAsync } from '../../lib/access/subscriptionState';
// perf metrics removed in lean profile
import { headers } from 'next/headers';
import React from 'react';
import PostCallbackStatus from '../../components/PostCallbackStatus';
import SignedOutPrompt from '../../components/SignedOutPrompt';

// Dashboard (T049): simple authenticated shell using header-based mock session.
// Uses NextAuth server session today; expand with real per-user DB queries as needed.

export default async function DashboardPage() {
    return (async () => {
        let reqLike: any;
        try {
            const hdrs = await headers();
            reqLike = { headers: hdrs } as any;
        } catch {
            // Outside of a Next request context (e.g., tests), provide a minimal headers shim
            reqLike = { headers: { get: (_key: string) => null } } as any;
        }
        const state = await deriveSubscriptionStateAsync(reqLike);
        if (!state.authenticated) return <SignedOutPrompt ariaLabel="Dashboard" />;

        // Usage quotas removed in Phase 1; keep dashboard minimal.

        return (
            <main aria-label="Dashboard" className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold" aria-current="page">Dashboard</h1>
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Current tier:</span>
                        <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">{state.tier}</code>
                    </p>
                    {state.rawSession?.userId && (
                        <p className="text-xs text-gray-500">Signed in as <code>{state.rawSession.userId}</code></p>
                    )}
                </header>
                {/* Brief status indicator shown immediately after OAuth callback; auto-hides shortly. */}
                <PostCallbackStatus />
                <section className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded p-4 bg-white text-sm space-y-3">
                        <h3 className="font-semibold text-sm">Getting started</h3>
                        <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                            <li>
                                Review your profile on <a className="text-blue-600 hover:underline" href="/account">Account</a>.
                            </li>
                            <li>
                                Manage your plan on <a className="text-blue-600 hover:underline" href="/billing">Billing</a> {state.tier !== 'premium' ? '(upgrade to unlock premium)' : '(you are on Premium)'}.
                            </li>
                            <li>
                                Check service health at <a className="text-blue-600 hover:underline" href="/api/health">/api/health</a>.
                            </li>
                        </ul>
                    </div>
                    <div className="border rounded p-4 bg-white text-sm space-y-3">
                        <h3 className="font-semibold text-sm">Tips</h3>
                        <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                            <li>Use the free tier to build; enable Stripe later with real keys.</li>
                            <li>Protect premium features with the included guard utilities.</li>
                            <li>See README for quickstart, envs, and deployment notes.</li>
                        </ul>
                    </div>
                </section>
            </main>
        );
    })();
}
