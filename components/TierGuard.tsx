import React from 'react';
import { Tier } from '@/lib/access/policy';
import { Alert, AlertDescription } from "@/components/ui/alert"

// TierGuard (T046)
// Server component friendly wrapper (kept simple here) gating children by tier.
// For now we accept tier via props; later we can resolve server-side using subscriptionState.

interface TierGuardProps {
    required: Tier;
    current: Tier;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function TierGuard({ required, current, children, fallback }: TierGuardProps) {
    const hierarchy: Tier[] = ['visitor', 'free', 'premium'];
    const allowed = hierarchy.indexOf(current) >= hierarchy.indexOf(required);
    if (allowed) return <>{children}</>;
    return (
        <Alert className="bg-muted/50">
            <AlertDescription>
                {fallback || <div>Requires {required} tier (current: {current}).</div>}
            </AlertDescription>
        </Alert>
    );
}
