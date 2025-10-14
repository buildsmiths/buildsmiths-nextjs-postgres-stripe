/**
 * Stripe Webhook processing (T035)
 * Verifies signature (skipped in non-production) and routes events.
 * Future: persistence + idempotency store, subscription status updates.
 */
import Stripe from 'stripe';
import { loadConfig } from '../config';
import { log } from '../logging/log';
import { recordAudit } from '../logging/audit';
import { upgradeToPremiumAsync, scheduleCancellationAsync, applyCancellationIfDueAsync } from '../subscriptions/store';
import { getWebhookRepo } from '../db';

export interface WebhookProcessResult {
    ok: boolean;
    type?: string;
    ignored?: boolean;
    error?: string;
}

export function verifySignatureAndParse(rawBody: string, signature: string | undefined): Stripe.Event {
    const cfg = loadConfig();
    if (cfg.nodeEnv !== 'production') {
        // Parse directly without verifying in dev/test
        return JSON.parse(rawBody);
    }
    const stripe = new Stripe(cfg.stripeSecretKey); // default API version
    return stripe.webhooks.constructEvent(rawBody, signature || '', cfg.stripeWebhookSecret);
}

// Idempotency via persistence repository (T085)
const webhookRepo = getWebhookRepo();

// Helper: attempt to infer user id (actor) from event payload (dev/test mock strategy)
function extractUserId(event: Stripe.Event): string | undefined {
    // In real implementation: map Stripe customer or metadata to internal user id via DB lookup.
    // For test/dev we allow embedding `userId` in object metadata if present.
    // Types are loose because of varied Stripe object shapes.
    const obj: any = event.data?.object;
    if (obj?.metadata?.userId) return obj.metadata.userId;
    if (obj?.customer_email) return obj.customer_email; // fallback heuristic (NOT for prod)
    return undefined;
}

export async function handleStripeWebhook(event: Stripe.Event): Promise<WebhookProcessResult> {
    const userId = extractUserId(event);
    const already = await webhookRepo.isProcessed(event.id);
    if (already) {
        await recordAudit('webhook.duplicate', { eventId: event.id, type: event.type, ok: true });
        return { ok: true, type: event.type, ignored: true };
    }
    await webhookRepo.recordProcessed(event.id, event.type, userId);
    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            log.info('subscription_event', { type: event.type, id: event.id, userId });
            if (userId) {
                if (event.type === 'customer.subscription.deleted') {
                    // schedule immediate cancellation (effective now) then apply
                    await scheduleCancellationAsync(userId, new Date());
                    await applyCancellationIfDueAsync(userId);
                    await recordAudit('subscription.canceled', { actor: userId, eventId: event.id });
                } else {
                    // treat created/updated as activation/upgrade to premium for prototype
                    await upgradeToPremiumAsync(userId);
                    await recordAudit('subscription.activated', { actor: userId, eventId: event.id, type: event.type });
                }
            } else {
                await recordAudit('subscription.webhook.missingUser', { eventType: event.type, eventId: event.id, ok: false });
            }
            await recordAudit('subscription.webhook', { eventType: event.type, eventId: event.id, ...(userId ? { actor: userId } : {}) });
            return { ok: true, type: event.type };
        case 'checkout.session.completed':
            log.info('checkout_completed', { id: event.id });
            await recordAudit('checkout.completed', { eventId: event.id, ...(userId ? { actor: userId } : {}) });
            return { ok: true, type: event.type };
        default:
            log.debug('webhook_unhandled', { type: event.type });
            await recordAudit('webhook.unhandled', { eventType: event.type, eventId: event.id });
            return { ok: true, type: event.type, ignored: true };
    }
}

export function clearProcessedWebhookIds() { /* repository-backed; no-op */ }
