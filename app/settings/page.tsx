import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import SignedOutPrompt from '@/components/SignedOutPrompt';
import { Button } from "@/components/ui/button"

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
            <div className="text-sm text-muted-foreground">
                Settings now live under <a className="text-primary hover:underline" href="/account">Account</a>.
            </div>
            <div>
                <Button asChild>
                    <a href="/account">Go to Account</a>
                </Button>
            </div>
        </main>
    );
}
