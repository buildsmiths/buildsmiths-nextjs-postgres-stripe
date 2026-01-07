# Blueprint: Billing & Subscriptions (Stripe)

**Goal**: A robust, secure, and flexible subscription system using Stripe Checkout and Customer Portal.

## 1. Objectives
- Support upgrading from Free to Premium.
- Support managing/cancelling subscriptions via Stripe Portal.
- Handle webhook events to sync state to the local database.

## 2. Dependencies
- `stripe` (Node SDK)
- `@stripe/stripe-js` (Client SDK - minimal usage)

## 3. Architecture
- **Schema**: `subscriptions` table (user_id, stripe_customer_id, stripe_subscription_id, status, tier, current_period_end).
- **Actions**: `app/billing/actions.ts` (Already migrated).
- **Webhooks**: `app/api/webhooks/stripe/route.ts` - The critical sync engine.

## 4. Requirements
- **Checkout Flow**: 
  - Create Checkout Session with `mode: 'subscription'`.
  - Pass `client_reference_id` as the `userId`.
  - Success URL points to `/billing?success=true`.
- **Portal Flow**:
  - Create Portal Session returning to `/billing`.
- **Webhook Handling**:
  - `checkout.session.completed`: Link `customer_id` and `subscription_id` to the user.
  - `customer.subscription.updated`: Update status, cancel_at_period_end, and current_period_end.
  - `customer.subscription.deleted`: Downgrade user to 'free'.
- **Local Dev**:
  - Use `stripe listen` CLI pattern or the existing logic which simulates webhooks if needed (but prefer real Stripe CLI for robust testing).

## 5. Security & Safety
- **Signature Verification**: ALWAYS verify webhook signature in Prod.
- **Idempotency**: Record `webhook_events` (id) to prevent processing the same event twice.

## 6. Implementation Prompt
> "Implement the Billing Blueprint. Review `lib/stripe/webhook.ts` and ensure it handles `customer.subscription.updated` correctly to sync `current_period_end` to the `subscriptions` table. Ensure `app/billing/actions.ts` is fully wired up. Verify that the table schema supports `stripe_customer_id`."
