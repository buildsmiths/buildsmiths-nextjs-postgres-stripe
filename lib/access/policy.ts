/**
 * Access policy & tier utilities (T031)
 * Provides Tier enum, getEffectiveTier, and enforceTier.
 * Future: integrate real subscription lookup & feature flags.
 */

export type Tier = 'visitor' | 'free' | 'premium';

export interface SessionLike {
    userId?: string | null;
    subscriptionStatus?: 'active' | 'canceled' | 'incomplete' | 'none';
    subscriptionTier?: 'free' | 'premium';
}

export interface EnforceResult {
    allowed: boolean;
    reason?: string;
    requiredTier: Tier;
    actualTier: Tier;
}

export function getEffectiveTier(session: SessionLike | undefined | null): Tier {
    if (!session || !session.userId) return 'visitor';
    if (session.subscriptionTier === 'premium' && session.subscriptionStatus === 'active') return 'premium';
    return 'free';
}

export function enforceTier(required: Tier, session: SessionLike | undefined | null): EnforceResult {
    const actual = getEffectiveTier(session);
    const hierarchy: Tier[] = ['visitor', 'free', 'premium'];
    const ok = hierarchy.indexOf(actual) >= hierarchy.indexOf(required);
    if (ok) {
        return { allowed: true, requiredTier: required, actualTier: actual };
    }
    return {
        allowed: false,
        requiredTier: required,
        actualTier: actual,
        reason: `Requires ${required} tier (current: ${actual})`
    };
}
