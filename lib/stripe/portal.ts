/**
 * Stripe Billing Portal helper (T034)
 * Provides createPortalSession; mocked in non-production envs.
 */
import Stripe from 'stripe';
import { loadConfig } from '../config';
import { log } from '../logging/log';

export interface PortalSession { id: string; url: string; }

export async function createPortalSession(userId: string, customerId?: string): Promise<PortalSession> {
    const cfg = loadConfig();
    if (cfg.nodeEnv !== 'production') {
        return { id: `bps_test_${Math.random().toString(36).slice(2)}`, url: `${cfg.siteUrl}/mock/portal` };
    }
    const stripe = new Stripe(cfg.stripeSecretKey); // default API version
    // Real implementation would look up customerId from profile; fallback placeholder.
    const portal = await stripe.billingPortal.sessions.create({
        customer: customerId || 'replace_with_customer_id',
        return_url: cfg.billingPortalReturnUrl
    });
    log.info('created_portal_session', { portalId: portal.id });
    return { id: portal.id, url: portal.url };
}
