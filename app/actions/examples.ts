'use server';

import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { enforceTier } from '@/lib/access/policy';
import { recordAudit } from '@/lib/logging/audit';
import { log } from '@/lib/logging/log';

export async function checkAuthStatusAction() {
    const started = Date.now();
    log.info('action.auth.status.enter', {});
    const hdrs = await headers();
    const reqLike = { headers: hdrs } as any;
    const state = await deriveSubscriptionStateAsync(reqLike);
    
    if (!state.rawSession) {
        log.info('action.auth.status.result', { authenticated: false, tier: state.tier, ms: Date.now() - started });
        return { ok: true, data: { authenticated: false, tier: state.tier } };
    }
    log.info('action.auth.status.result', { authenticated: true, tier: state.tier, ms: Date.now() - started });
    return { ok: true, data: { authenticated: true, tier: state.tier, user: { id: state.rawSession.userId } } };
}

export async function getPremiumFeatureAction() {
    const started = Date.now();
    log.info('action.feature.premiumExample.enter', {});
    const hdrs = await headers();
    const reqLike = { headers: hdrs } as any;
    const state = await deriveSubscriptionStateAsync(reqLike);
    
    const res = enforceTier('premium', state.rawSession);
    if (!res.allowed) {
        recordAudit('feature.access.denied', { reason: res.reason || 'tier', ok: false });
        log.info('action.feature.premiumExample.denied', { reason: res.reason, ms: Date.now() - started });
        return { ok: false, error: 'UPGRADE_REQUIRED', reason: res.reason };
    }
    
    recordAudit('feature.access.granted', { feature: 'premium-example' });
    log.info('action.feature.premiumExample.success', { ms: Date.now() - started });
    
    return { ok: true, data: { feature: 'premium-example', message: 'Premium content unlocked!' } };
}
