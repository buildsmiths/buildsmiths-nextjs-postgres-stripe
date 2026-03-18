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

## Acceptance Criteria
- [ ] User can successfully upgrade to premium via real Stripe Checkout.
- [ ] Subscriptions table accurately associates Stripe customer/subscription IDs to the user.
- [ ] Webhook successfully processes `checkout.session.completed` and `customer.subscription.updated/deleted` events idempotently.
- [ ] User can manage their subscription in the Stripe Customer Portal.
