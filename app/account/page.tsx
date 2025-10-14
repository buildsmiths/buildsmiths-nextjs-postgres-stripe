import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '../../lib/access/subscriptionState';
import SignedOutPrompt from '../../components/SignedOutPrompt';

export default async function AccountPage() {
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);

    if (!state.authenticated) return <SignedOutPrompt ariaLabel="Account" />;

    return (
        <main aria-label="Account" className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Account</h1>
                <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs" aria-label={`Tier: ${state.tier}`}>{(state.tier as any) || 'free'}</code>
            </div>
            <section aria-label="Profile" className="text-sm text-gray-700 space-y-1">
                <div>
                    <span className="text-gray-500">User ID:</span>{' '}
                    <code>{state.rawSession?.userId}</code>
                </div>
                {/* Email is available when a NextAuth session includes it (credentials flow stores email). */}
                {('email' in (state.rawSession || {}) && (state as any).rawSession?.email) ? (
                    <div>
                        <span className="text-gray-500">Email:</span>{' '}
                        <code>{(state as any).rawSession.email}</code>
                    </div>
                ) : null}
                {/* When DB-backed repo provides a current period end, surface it read-only */}
                {(() => {
                    // Our state doesn't expose period end directly; we can only display it if
                    // store lookup later enriches state. For now, read from subscription store if present on tier state.
                    // Note: deriveSubscriptionStateAsync currently returns effective tier only; period end rendering
                    // acts as a future hook. To avoid coupling, we display none unless available on global store in DB mode.
                    const anyState = state as any;
                    const period: Date | string | undefined = anyState?.subscription?.currentPeriodEnd || anyState?.currentPeriodEnd;
                    if (!period) return null;
                    const d = (period instanceof Date) ? period : new Date(period);
                    if (Number.isNaN(d.getTime())) return null;
                    const iso = d.toISOString().slice(0, 10);
                    return (
                        <div>
                            <span className="text-gray-500">Current period end:</span>{' '}
                            <code>{iso}</code>
                        </div>
                    );
                })()}
            </section>
            <section aria-label="Billing" className="pt-4">
                {state.tier === 'premium' ? (
                    <div>
                        <a className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm" aria-label="Manage billing" href="/billing">Manage billing</a>
                    </div>
                ) : (
                    <p className="text-xs text-gray-500">Upgrade to manage billing and access premium features.</p>
                )}
            </section>
            <section aria-label="Getting started" className="border rounded p-4 bg-white text-sm space-y-3">
                <h3 className="font-semibold text-sm">Next steps</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                    <li>
                        Manage your plan on <a className="text-blue-600 hover:underline" href="/billing">Billing</a> {state.tier !== 'premium' ? '(upgrade to unlock premium)' : '(you are on Premium)'}.
                    </li>
                    <li>
                        Try a gated endpoint: <a className="text-blue-600 hover:underline" href="/api/feature/premium-example">/api/feature/premium-example</a> {state.tier !== 'premium' ? '(returns "forbidden" on free)' : '(works on Premium)'}.
                    </li>
                    <li>
                        Check service health at <a className="text-blue-600 hover:underline" href="/api/health">/api/health</a>.
                    </li>
                </ul>
            </section>
        </main>
    );
}
