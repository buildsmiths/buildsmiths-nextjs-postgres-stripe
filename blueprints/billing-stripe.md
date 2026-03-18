# Spec: Stripe Billing

## Goal
Implement Stripe Checkout & Customer Portal, transitioning from the default Mock Mode to the real Stripe API.

## Architecture Decisions
- Schema: Ensure the `subscriptions` table is updated to include `stripe_customer_id` and `stripe_subscription_id`.
- Actions: `app/account/actions.ts` should handle redirects to the Stripe Checkout and Customer Portal.
- Webhooks: `app/api/webhooks/stripe/route.ts` is responsible for handling incoming Stripe event syncs.
- DB logic should be placed in `lib/db/simple.ts` or a new repository to save the Stripe IDs when modified.

## Constraints & Rules
- Minimal disruption: Maintain the "Mock Mode" for local development so it can run without API keys. Only use the real API if `STRIPE_SECRET_KEY` is present.
- Webhooks must validate Stripe signatures accurately in production.
- Webhooks must use the existing `webhook_events` table for idempotency to prevent duplicate processing.
- Do not add alternative billing providers. Keep it strictly Stripe.

## Reference Implementation

The following is the standard Buildsmiths boilerplate for Stripe integration. Copy these files into your project when you are ready to implement real payments. Install the `stripe` npm package before using.

### 1. `lib/stripe/checkout.ts`
```typescript
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
```

### 2. `lib/stripe/portal.ts`
```typescript
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
    const stripe = new Stripe(cfg.stripeSecretKey); // default API version
    // Real implementation would look up customerId from profile; fallback placeholder.
    const portal = await stripe.billingPortal.sessions.create({
        customer: customerId || 'replace_with_customer_id',
        return_url: cfg.billingPortalReturnUrl
    });
    log.info('created_portal_session', { portalId: portal.id });
    return { id: portal.id, url: portal.url };
}
```

### 3. `lib/stripe/webhook.ts`
```typescript
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
    const stripe = new Stripe(cfg.stripeSecretKey); // default API version
    return stripe.webhooks.constructEvent(rawBody, signature || '', cfg.stripeWebhookSecret);
}

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
    const webhookRepo = getWebhookRepo();
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
```

### 4. `app/api/webhooks/stripe/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAndParse, handleStripeWebhook } from '@/lib/stripe/webhook';
import { log } from '@/lib/logging/log';


export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const started = Date.now();
    log.info('route.webhooks.stripe.enter', {});
    try {
        const signature = req.headers.get('stripe-signature') || undefined;
        const rawBody = await req.text();
        const event = verifySignatureAndParse(rawBody, signature);
        const result = await handleStripeWebhook(event as any);
        log.info('route.webhooks.stripe.result', { type: result.type, ignored: result.ignored, ms: Date.now() - started });
        const body = { ok: result.ok, type: result.type, ignored: result.ignored };
        return NextResponse.json({ ...body, ok: true });
    } catch (error: any) {
        log.error('route.webhooks.stripe.error', { error: error.message || String(error), ms: Date.now() - started });
        return NextResponse.json({ error: 'Webhook processing failed', detail: error.message || String(error) }, { status: 400 });
    }
}
```

### 5. `db/schema.sql` (Additions)
Add these fields to your `subscriptions` table and create the `webhook_events` table for idempotency:

```sql
-- Add to Subscriptions (if they don't exist)
ALTER TABLE public.subscriptions ADD COLUMN stripe_customer_id text;
ALTER TABLE public.subscriptions ADD COLUMN stripe_subscription_id text;
create unique index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

-- Webhook idempotency
create table if not exists public.webhook_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now(),
  user_id text,
  duplicate boolean not null default false
);
create index if not exists idx_webhook_events_processed_at on public.webhook_events(processed_at desc);
create index if not exists idx_webhook_events_type on public.webhook_events(type);
```

### 6. `lib/db/webhookRepo.ts`
```typescript
export interface QueryResult<Row = any> { rows: Row[] }
export type QueryRunner = (sql: string, params: any[]) => Promise<QueryResult>;

export interface DbWebhookRow {
    id: string;
    type: string;
    user_id?: string | null;
    duplicate: boolean;
    processed_at?: string;
}

export function createDbWebhookRepo(run: QueryRunner) {
    return {
        async recordProcessed(id: string, type: string, userId?: string) {
            const sql = `INSERT INTO webhook_events (id, type, user_id, duplicate)
                         VALUES ($1, $2, $3, false)
                         ON CONFLICT (id) DO UPDATE SET duplicate = true
                         RETURNING duplicate`;
            const { rows } = await run(sql, [id, type, userId ?? null]);
            const duplicate = rows[0]?.duplicate === true;
            return { duplicate };
        },
        async isProcessed(id: string) {
            const sql = `SELECT 1 FROM webhook_events WHERE id = $1 LIMIT 1`;
            const { rows } = await run(sql, [id]);
            return rows.length > 0;
        }
    };
}

export type DbWebhookRepo = ReturnType<typeof createDbWebhookRepo>;
```
