import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import DevStatusChips from '@/components/dev-tools/DevStatusChips';
import BlueprintStatus from '@/components/dev-tools/BlueprintStatus';
import { SystemActivityChart, ResourceUsageChart } from '@/components/admin/DashboardCharts';
// perf metrics removed in lean profile
import { headers } from 'next/headers';
import React from 'react';
import PostCallbackStatus from '@/components/PostCallbackStatus';
import SignedOutPrompt from '@/components/SignedOutPrompt';
import NextStepsCard from '@/components/NextStepsCard';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

// Admin Dashboard: Central hub for the developer to see system status and next steps.

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

        return (
            <main aria-label="Admin Dashboard" className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {!state.authenticated && (
                    <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 mb-6 text-sm flex items-center justify-between">
                        <p>👀 <strong>Public Demo Mode</strong>: You are viewing this admin panel as a Visitor.</p>
                        <Button variant="secondary" size="sm" asChild>
                            <a href="/quickstart">Get the Code</a>
                        </Button>
                    </div>
                )}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight" aria-current="page">Admin Dashboard</h1>
                            <Badge variant="outline" className="ml-2">Dev Environment</Badge>
                        </div>
                        <p className="text-muted-foreground">
                            System status, recent activity, and developer tasks.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {state.authenticated ? (
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Logged in as</p>
                                <p className="text-sm font-medium">{state.rawSession?.email || 'User'}</p>
                            </div>
                        ) : (
                            <Button size="sm" asChild>
                                <a href="/auth">Sign In to Admin</a>
                            </Button>
                        )}
                    </div>
                </header>

                <DevStatusChips />

                {/* Brief status indicator shown immediately after OAuth callback; auto-hides shortly. */}
                <PostCallbackStatus />

                {/* Charts Row */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SystemActivityChart />
                    <ResourceUsageChart />
                </section>

                <section className="grid md:grid-cols-2 gap-6">
                    <NextStepsCard
                        title="Action Items"
                        items={[
                            <span><strong>Config Audit</strong>: Review <code>.env.local</code> and ensure <code>STRIPE_SECRET_KEY</code> is set for billing.</span>,
                            <span><strong>Database</strong>: Check <code>npm run db:status</code> (simulated) or inspect via psql.</span>,
                            <span><strong>Users</strong>: You have {state.authenticated ? '1 (Self)' : '0 (Guest)'} active session.</span>,
                        ]}
                    />
                    <NextStepsCard
                        title="Developer Resources"
                        items={[
                            <span><a className="text-primary hover:underline" href="/quickstart">Quickstart Guide</a>: Re-visit installation steps.</span>,
                            <span><a className="text-primary hover:underline" href="/?scroll=blueprints">Blueprints</a>: See available AI-native specs.</span>,
                            <span><a className="text-primary hover:underline" href="/api/health" target="_blank">Health Check API</a>: View raw JSON status.</span>,
                        ]}
                    />
                </section>

                <BlueprintStatus />
            </main>
        );
    })();
}
