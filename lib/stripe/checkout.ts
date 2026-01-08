/**
 * Stripe Checkout helper (T033)
 * Provides createCheckoutSession; mocked in non-production envs.
 */
import Stripe from 'stripe';
import { loadConfig } from '../config';
import { log } from '../logging/log';

export interface CheckoutSession {
    id: string;
    url: string;
}

export async function createCheckoutSession(userId: string, priceId?: string): Promise<CheckoutSession> {
    const cfg = loadConfig();
    const price = priceId || cfg.premiumPlanPriceId;
    if (cfg.nodeEnv !== 'production') {
        return { id: `cs_test_${Math.random().toString(36).slice(2)}`, url: `${cfg.siteUrl}/mock/checkout?price=${price}` };
    }
    const stripe = new Stripe(cfg.stripeSecretKey); // use default api version from SDK
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price, quantity: 1 }],
        success_url: `${cfg.siteUrl}/dashboard?upgrade=success`,
        cancel_url: `${cfg.siteUrl}/account?upgrade=cancel`,
        metadata: { userId }
    });
    log.info('created_checkout_session', { sessionId: session.id });
    return { id: session.id, url: session.url || '' };
}
