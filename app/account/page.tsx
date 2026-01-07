import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import SignedOutPrompt from '@/components/SignedOutPrompt';
import NextStepsCard from '@/components/NextStepsCard';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AccountPage() {
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);

    return (
        <main aria-label="Account" className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            {!state.authenticated && (
                <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 mb-6 text-sm flex items-center justify-between">
                    <p>👀 <strong>Public Demo Mode</strong>: You are viewing this page as a Visitor.</p>
                    <Button variant="secondary" size="sm" asChild>
                        <a href="/auth">Sign In to Test Real Auth</a>
                    </Button>
                </div>
            )}
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Account</h1>
                <Badge variant="secondary" className="font-mono text-xs" aria-label={`Tier: ${state.tier}`}>
                    {(state.tier as any) || 'free'}
                </Badge>
            </div>
            <section aria-label="Profile" className="text-sm text-foreground space-y-1">
                <div>
                    <span className="text-muted-foreground">User ID:</span>{' '}
                    <code>{state.rawSession?.userId || 'guest_user'}</code>
                </div>
                {/* Email is available when a NextAuth session includes it (credentials flow stores email). */}
                {state.authenticated && ('email' in (state.rawSession || {}) && (state as any).rawSession?.email) ? (
                    <div>
                        <span className="text-muted-foreground">Email:</span>{' '}
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
                            <span className="text-muted-foreground">Current period end:</span>{' '}
                            <code>{iso}</code>
                        </div>
                    );
                })()}
            </section>
            <section aria-label="Preferences" className="space-y-2 pt-2">
                <h2 className="text-xl font-medium">Preferences</h2>
                <p className="text-sm text-muted-foreground">Coming soon.</p>
            </section>
            <section aria-label="Billing" className="pt-4">
                {state.tier === 'premium' ? (
                    <div>
                        <Button asChild variant="link" className="p-0 h-auto">
                            <a aria-label="Manage billing" href="/billing">Manage billing</a>
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">Upgrade to manage billing and access premium features.</p>
                )}
            </section>
            <NextStepsCard
                items={[
                    <span>Manage your plan on <a className="text-primary hover:underline" href="/billing">Billing</a> {state.tier !== 'premium' ? '(upgrade to unlock premium)' : '(you are on Premium)'}.</span>,
                    <span>Try a gated endpoint: <a className="text-primary hover:underline" href="/api/feature/premium-example">/api/feature/premium-example</a> {state.tier !== 'premium' ? '(returns "forbidden" on free)' : '(works on Premium)'}.</span>,
                    <span>Check service health at <a className="text-primary hover:underline" href="/api/health">/api/health</a>.</span>,
                ]}
            />
        </main>
    );
}
