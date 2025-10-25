import { NextRequest, NextResponse } from 'next/server';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { log } from '@/lib/logging/log';
import { ok } from '@/lib/errors';

// T036: Auth status route (mock session integration for now).
// Placeholder: derive session from header x-user-id and x-user-premium for tests.

export async function GET(req: NextRequest) {
    const started = Date.now();
    log.info('route.auth.status.enter', {});
    const state = await deriveSubscriptionStateAsync(req);
    if (!state.rawSession) {
        const body = { authenticated: false, tier: state.tier };
        log.info('route.auth.status.result', { authenticated: false, tier: state.tier, ms: Date.now() - started });
        return NextResponse.json(ok(body));
    }
    const body = { authenticated: true, tier: state.tier, user: { id: state.rawSession.userId } };
    log.info('route.auth.status.result', { authenticated: true, tier: state.tier, ms: Date.now() - started });
    return NextResponse.json(ok(body));
}
