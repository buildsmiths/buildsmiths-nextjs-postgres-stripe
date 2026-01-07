import React from 'react';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { isStripeConfigured } from '@/lib/config';
import { headers } from 'next/headers';
import SignedOutPrompt from '@/components/SignedOutPrompt';
import NextStepsCard from '@/components/NextStepsCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { upgradeSubscription, manageSubscription } from './actions';

import { ContextCard } from '@/components/dev-tools/ContextCard';

// Billing Page (T050)
// Provides upgrade (checkout) and portal management entry points.

export default async function BillingPage() {
    const isDev = process.env.NODE_ENV === 'development';
    const configured = isStripeConfigured();
    if (!configured) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl font-bold">Billing</h1>
                    <p className="text-sm text-muted-foreground">You are on the free tier. Billing is currently disabled until real Stripe keys are provided.</p>
                </header>
                <Alert variant="destructive" className="bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Required</AlertTitle>
                    <AlertDescription className="space-y-2 mt-2">
                        <p>To enable upgrade and portal flows, add real Stripe env vars to <code>.env.local</code> and restart.</p>
                        <ul className="list-disc list-inside text-xs font-mono">
                            <li>NEXT_PUBLIC_STRIPE_PUBLIC_KEY</li>
                            <li>STRIPE_SECRET_KEY</li>
                            <li>STRIPE_WEBHOOK_SECRET</li>
                            <li>PREMIUM_PLAN_PRICE_ID</li>
                            <li>BILLING_PORTAL_RETURN_URL</li>
                        </ul>
                        <p className="pt-1">Until then, API routes return a structured <code>stripe_not_configured</code> and UI upgrade controls remain disabled.</p>
                    </AlertDescription>
                </Alert>
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
                <p className="text-sm text-muted-foreground">Manage your subscription and plan.</p>
            </header>
            <section className="space-y-4">
                {!premium && (
                    <div className="space-y-2">
                        <h2 className="font-semibold text-sm">Upgrade to Premium</h2>
                        <form action={upgradeSubscription}>
                            <Button type="submit">Start Upgrade</Button>
                        </form>
                    </div>
                )}
                {premium && (
                    <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800 [&>svg]:text-green-600 dark:[&>svg]:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Premium Active</AlertTitle>
                        <AlertDescription className="mt-2">
                            <div className="text-sm font-medium mb-2">You are on the Premium plan.</div>
                            <form action={manageSubscription}>
                                <Button variant="outline" size="sm" className="bg-transparent border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900/50" type="submit">
                                    Open Customer Portal
                                </Button>
                            </form>
                        </AlertDescription>
                    </Alert>
                )}
            </section>
            <NextStepsCard
                items={[
                    <span>In non-production, endpoints return mock checkout/portal identifiers until real Stripe keys are set.</span>,
                    <span>Review your <a className="text-primary hover:underline" href="/account">Account</a> and confirm your tier.</span>,
                    <span>Try the gated API: <a className="text-primary hover:underline" href="/api/feature/premium-example">/api/feature/premium-example</a> {premium ? '(unlocked on Premium)' : '(403 on free)'}.</span>,
                    <span>Need help? See the quickstart in the README for setup steps.</span>,
                ]}
            />
            {isDev && (
                <ContextCard
                    title="Stripe & Billing Context"
                    description="This page interacts with lib/stripe/checkout.ts and lib/stripe/portal.ts. The logic is handled by server actions in app/billing/actions.ts."
                    prompt="Here is the schema for the `subscriptions` table and the `checkout.ts` logic. Help me add a 'trial period' feature..."
                    fileLocation="lib/stripe/"
                />
            )}
        </div>
    );
}
