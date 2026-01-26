# Blueprint: Billing & Subscriptions (Stripe)

**Goal**: Activate the pre-configured subscription system (Stripe Checkout & Customer Portal) for production.

## 1. Context
The codebase includes a fully typed Stripe integration in `lib/stripe/*` and `app/api/webhooks/stripe`.
- **Development**: Runs in "Mock Mode" by default. No API keys required.
- **Production**: Needs configuration and activation.

## 2. Pre-requisites
- A Stripe Account (Test mode is fine).
- One "Product" created in Stripe Dashboard (e.g. "Premium Plan").
- **Environment Variables** (Add these to `.env.local`):
  ```bash
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  PREMIUM_PLAN_PRICE_ID=price_...
  BILLING_PORTAL_RETURN_URL=http://localhost:3000/account
  ```

## 3. Architecture
- **Schema**: `subscriptions` table (Updated to include `stripe_customer_id`, `stripe_subscription_id`).
- **Actions**: `app/account/actions.ts` handles redirects to Checkout/Portal.
- **Webhooks**: `app/api/webhooks/stripe/route.ts` handles syncing.

## 4. Activation Prompt
> "I want to activate the Billing Blueprint.
> 1. Review `lib/subscriptions/store.ts` and update the `SubscriptionRecord` interface to match the new schema (add `stripeCustomerId`).
> 2. Update `lib/db/simple.ts` (or the relevant repo) to save `stripe_customer_id` when a subscription is created/updated.
> 3. Update `lib/stripe/portal.ts` to fetch the real `stripeCustomerId` from the DB using the `userId` before creating the Portal Session.
> 4. Verify that `lib/stripe/webhook.ts` maps `stripe_customer_id` from the webhook payload back to the core `userId`."

## 5. Security & Safety
- **Signature Verification**: The existing code in `lib/stripe/webhook.ts` already handles verfication in production.
- **Idempotency**: `webhook_events` table prevents duplicate processing.

## 6. Constraints
- Do not remove the "Mock Mode" logic in `checkout.ts` and `portal.ts`; it is essential for local dev.

