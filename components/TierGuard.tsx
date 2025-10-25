import React from 'react';
import { Tier } from '@/lib/access/policy';

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
        <div className="border rounded p-4 space-y-2 text-sm bg-gray-50">
            {fallback || <div>Requires {required} tier (current: {current}).</div>}
        </div>
    );
}
