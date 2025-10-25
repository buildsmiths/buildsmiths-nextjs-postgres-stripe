import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveTier } from '@/lib/access/policy';
import { createPortalSession } from '@/lib/stripe/portal';
import { recordAudit } from '@/lib/logging/audit';
import { log } from '@/lib/logging/log';
import { err, ok } from '@/lib/errors';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { isStripeConfigured } from '@/lib/config';

// T038: Subscriptions portal route.

export async function POST(req: NextRequest) {
    const started = Date.now();
    log.info('route.subscriptions.portal.enter', {});
    // Billing is governed by Stripe configuration; if not configured, return 503
    if (!isStripeConfigured()) {
        log.info('route.subscriptions.portal.stripeNotConfigured', { ms: Date.now() - started });
        recordAudit('subscription.portal.denied', { reason: 'stripe-not-configured', ok: false });
        return NextResponse.json(err('STRIPE_NOT_CONFIGURED', 'Stripe is not configured yet. See docs to enable billing.'), { status: 503 });
    }
    const state = await deriveSubscriptionStateAsync(req);
    if (!state.rawSession) {
        recordAudit('subscription.portal.denied', { reason: 'unauthorized', ok: false });
        log.warn('route.subscriptions.portal.unauthorized', { ms: Date.now() - started });
        return NextResponse.json(err('UNAUTHORIZED', 'Unauthorized'), { status: 401 });
    }
    const session = state.rawSession;
    const tier = getEffectiveTier(session);
    if (tier !== 'premium') {
        recordAudit('subscription.portal.denied', { actor: session.userId!, reason: 'not-premium', ok: false });
        log.info('route.subscriptions.portal.notPremium', { userId: session.userId!, ms: Date.now() - started });
        return NextResponse.json(err('NOT_PREMIUM', 'Not premium'), { status: 403 });
    }
    // Already validated as configured above
    const portal = await createPortalSession(session.userId!);
    recordAudit('subscription.portal.requested', { actor: session.userId!, portalId: portal.id });
    log.info('route.subscriptions.portal.success', { userId: session.userId!, portalId: portal.id, ms: Date.now() - started });
    const body = { url: portal.url, id: portal.id };
    return NextResponse.json(ok(body));
}
