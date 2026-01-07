import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import DevStatusChips from '@/components/dev-tools/DevStatusChips';
import BlueprintStatus from '@/components/dev-tools/BlueprintStatus';
// perf metrics removed in lean profile
import { headers } from 'next/headers';
import React from 'react';
import PostCallbackStatus from '@/components/PostCallbackStatus';
import SignedOutPrompt from '@/components/SignedOutPrompt';
import NextStepsCard from '@/components/NextStepsCard';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

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
        // if (!state.authenticated) return <SignedOutPrompt ariaLabel="Dashboard" />;

        // Usage quotas removed in Phase 1; keep dashboard minimal.

        return (
            <main aria-label="Dashboard" className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {!state.authenticated && (
                    <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 mb-6 text-sm flex items-center justify-between">
                        <p>👀 <strong>Public Demo Mode</strong>: You are viewing this dashboard as a Visitor.</p>
                        <Button variant="secondary" size="sm" asChild>
                            <a href="/quickstart">Get the Code</a>
                        </Button>
                    </div>
                )}
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold" aria-current="page">Dashboard</h1>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Current tier:</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {state.tier}
                        </Badge>
                    </p>
                    <DevStatusChips />
                    {state.rawSession?.userId && (
                        <p className="text-xs text-muted-foreground">Signed in as <code>{state.rawSession.userId}</code></p>
                    )}
                </header>
                {/* Brief status indicator shown immediately after OAuth callback; auto-hides shortly. */}
                <PostCallbackStatus />
                <section className="grid md:grid-cols-2 gap-6">
                    <NextStepsCard
                        items={[
                            <span>Review your profile on <a className="text-primary hover:underline" href="/account">Account</a>.</span>,
                            <span>Manage your plan on <a className="text-primary hover:underline" href="/billing">Billing</a> {state.tier !== 'premium' ? '(upgrade to unlock premium)' : '(you are on Premium)'}.</span>,
                            <span>Check service health at <a className="text-primary hover:underline" href="/api/health">/api/health</a>.</span>,
                        ]}
                    />
                    <NextStepsCard
                        title="Tips"
                        items={[
                            <span>Use the free tier to build; enable Stripe later with real keys.</span>,
                            <span>Protect premium features with the included guard utilities.</span>,
                            <span>See README for quickstart, envs, and deployment notes.</span>,
                        ]}
                    />
                </section>
                <BlueprintStatus />
            </main>
        );
    })();
}
