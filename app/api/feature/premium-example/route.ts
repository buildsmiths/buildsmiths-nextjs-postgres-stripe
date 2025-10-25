import { NextRequest, NextResponse } from 'next/server';
import { enforceTier } from '@/lib/access/policy';
import { recordAudit } from '@/lib/logging/audit';
import { log } from '@/lib/logging/log';
import { err, ok } from '@/lib/errors';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';

// Premium feature route; uses async state derivation (headers for tests, NextAuth-backed session otherwise).

export async function GET(req: NextRequest) {
    const started = Date.now();
    log.info('route.feature.premiumExample.enter', {});
    const state = await deriveSubscriptionStateAsync(req);
    const res = enforceTier('premium', state.rawSession);
    if (!res.allowed) {
        recordAudit('feature.access.denied', { reason: res.reason || 'tier', ok: false });
        log.info('route.feature.premiumExample.denied', { reason: res.reason, ms: Date.now() - started });
        return NextResponse.json(err('UPGRADE_REQUIRED', 'Upgrade required', undefined, { reason: res.reason }), { status: 403 });
    }
    recordAudit('feature.access.granted', { feature: 'premium-example' });
    log.info('route.feature.premiumExample.success', { ms: Date.now() - started });
    const body = { feature: 'premium-example', message: 'Premium content unlocked!' };
    return NextResponse.json(ok(body));
}
