import React from 'react';
import { deriveSubscriptionStateAsync } from '../../lib/access/subscriptionState';
import { isStripeConfigured } from '../../lib/config';
import { headers } from 'next/headers';
import SignedOutPrompt from '../../components/SignedOutPrompt';

// Billing Page (T050)
// Provides upgrade (checkout) and portal management entry points.

export default async function BillingPage() {
    const configured = isStripeConfigured();
    if (!configured) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl font-bold">Billing</h1>
                    <p className="text-sm text-gray-600">You are on the free tier. Billing is currently disabled until real Stripe keys are provided.</p>
                </header>
                <div className="rounded border p-4 bg-yellow-50 text-yellow-800 text-sm space-y-2">
                    <p>To enable upgrade and portal flows, add real Stripe env vars to <code>.env.local</code> and restart.</p>
                    <ul className="list-disc list-inside">
                        <li><code>NEXT_PUBLIC_STRIPE_PUBLIC_KEY</code></li>
                        <li><code>STRIPE_SECRET_KEY</code></li>
                        <li><code>STRIPE_WEBHOOK_SECRET</code> (for webhooks)</li>
                        <li><code>PREMIUM_PLAN_PRICE_ID</code></li>
                        <li><code>BILLING_PORTAL_RETURN_URL</code></li>
                    </ul>
                    <p className="pt-1">Until then, API routes return a structured <code>stripe_not_configured</code> and UI upgrade controls remain disabled.</p>
                </div>
            </div>
        );
    }
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);
    if (!state.authenticated) return <SignedOutPrompt ariaLabel="Billing" />;
    const premium = state.tier === 'premium';
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
            <header className="space-y-2">
                <h1 className="text-2xl font-bold">Billing</h1>
                <p className="text-sm text-gray-600">Manage your subscription and plan.</p>
            </header>
            <section className="space-y-4">
                {!premium && (
                    <div className="space-y-2">
                        <h2 className="font-semibold text-sm">Upgrade to Premium</h2>
                        <form action="/api/subscriptions/checkout" method="POST">
                            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-500" type="submit">Start Upgrade</button>
                        </form>
                    </div>
                )}
                {premium && (
                    <div className="border rounded p-4 bg-green-50 text-green-800 space-y-2">
                        <div className="text-sm font-medium">You are on the Premium plan.</div>
                        <form action="/api/subscriptions/portal" method="POST">
                            <button className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-500" type="submit">Open Customer Portal</button>
                        </form>
                    </div>
                )}
            </section>
            <section aria-label="Getting started" className="border rounded p-4 bg-white text-sm space-y-3">
                <h3 className="font-semibold text-sm">Next steps</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                    <li>
                        In non-production, endpoints return mock checkout/portal identifiers until real Stripe keys are set.
                    </li>
                    <li>
                        Review your <a className="text-blue-600 hover:underline" href="/account">Account</a> and confirm your tier.
                    </li>
                    <li>
                        Try the gated API: <a className="text-blue-600 hover:underline" href="/api/feature/premium-example">/api/feature/premium-example</a> {premium ? '(unlocked on Premium)' : '(403 on free)'}.
                    </li>
                    <li>
                        Need help? See the quickstart in the README for setup steps.
                    </li>
                </ul>
            </section>
        </div>
    );
}
