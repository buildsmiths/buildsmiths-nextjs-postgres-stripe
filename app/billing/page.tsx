import React from 'react';
import { deriveSubscriptionStateAsync } from '../../lib/access/subscriptionState';
import { isStripeConfigured } from '../../lib/config';
import { headers } from 'next/headers';

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
            <section className="text-xs text-gray-500 space-y-1">
                <p>Non-production runs return mock checkout/portal identifiers. Configure real Stripe keys and webhooks before launch.</p>
                <p>Need help? See Quickstart in the README for setup steps.</p>
            </section>
        </div>
    );
}
