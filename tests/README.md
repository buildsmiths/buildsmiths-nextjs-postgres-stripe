# Test suite

This repo ships with a lean, fast test baseline that exercises the essentials:

- `tests/contract` — API contract and envelope behavior for auth, billing, and webhooks.
- `tests/integration` — End-to-end flows like upgrade and webhook idempotency, plus signed-in/out UI states.
- `tests/ui` — A couple of accessibility/navigation checks.
- `tests/unit` — A few targeted logic checks.

Most tests run against an in-memory Postgres (`pg-mem`) with lightweight mocks, so no external DB or Stripe account is required for the default run.

## Run tests

- Single run: `npm test` (runs `vitest run`)
- Watch mode: `npm run test:watch`

Notes
- Tests read env from `.env.local` if present, but they do not require live credentials.
- Stripe flows use safe placeholder keys; webhook tests validate envelope handling and idempotency locally.

## What’s covered

- Auth status envelope (unauthenticated and authenticated)
- Subscriptions checkout (envelope mode)
- Stripe webhook handling and envelope error on invalid signature/body
- Webhook idempotency
- Upgrade flow from free to premium (simulated checkout + webhook)
- Basic UI smoke for header nav and skip link
- Minimal unit checks for auth redirects/signout

Use this as a starter and add tests alongside new behavior.
