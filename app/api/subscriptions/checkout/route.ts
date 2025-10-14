import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveTier } from '../../../../lib/access/policy';
import { createCheckoutSession } from '../../../../lib/stripe/checkout';
import { recordAudit } from '../../../../lib/logging/audit';
import { log } from '../../../../lib/logging/log';
import { err, ok } from '../../../../lib/errors';
import { deriveSubscriptionStateAsync } from '../../../../lib/access/subscriptionState';
import { isStripeConfigured } from '../../../../lib/config';

// T037: Subscriptions checkout route.

export async function POST(req: NextRequest) {
    const started = Date.now();
    log.info('route.subscriptions.checkout.enter', {});
    const state = await deriveSubscriptionStateAsync(req);
    if (!state.rawSession) {
        recordAudit('subscription.checkout.denied', { reason: 'unauthorized', ok: false });
        log.warn('route.subscriptions.checkout.unauthorized', { ms: Date.now() - started });
        return NextResponse.json(err('UNAUTHORIZED', 'Unauthorized'), { status: 401 });
    }
    const session = state.rawSession;
    const tier = getEffectiveTier(session);
    if (tier === 'premium') {
        recordAudit('subscription.checkout.denied', { actor: session.userId!, reason: 'already-premium', ok: false });
        log.info('route.subscriptions.checkout.alreadyPremium', { userId: session.userId!, ms: Date.now() - started });
        return NextResponse.json(err('ALREADY_PREMIUM', 'Already premium'), { status: 400 });
    }
    // Stripe placeholder mode: allow build/run without full Stripe setup
    if (!isStripeConfigured()) {
        log.info('route.subscriptions.checkout.stripeNotConfigured', { ms: Date.now() - started });
        recordAudit('subscription.checkout.denied', { actor: session.userId!, reason: 'stripe-not-configured', ok: false });
        return NextResponse.json(err('STRIPE_NOT_CONFIGURED', 'Stripe is not configured yet. See docs to enable billing.'), { status: 503 });
    }
    const checkout = await createCheckoutSession(session.userId!);
    recordAudit('subscription.checkout.requested', { actor: session.userId!, checkoutId: checkout.id });
    log.info('route.subscriptions.checkout.success', { userId: session.userId!, checkoutId: checkout.id, ms: Date.now() - started });
    const body = { url: checkout.url, id: checkout.id };
    return NextResponse.json(ok(body));
}
