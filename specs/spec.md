# Project Spec (v1)

This document describes the architecture, behavior, and contracts for the Next.js + Postgres + Stripe starter in this repo. It mirrors the current implementation and test suite so newcomers can confidently build on it.

## 1) Architecture overview

- Next.js 15 App Router
  - UI routes under `app/`
  - API routes under `app/api/*`
- Auth.js (NextAuth)
  - Credentials provider (email + password)
  - JWT sessions; no sessions table required
  - Postgres (required) with tables: `users`, `subscriptions`, `audit_events`, `webhook_events`
- Stripe (optional at first)
  - Checkout and Billing Portal mocked in non-production
  - Webhook route verifies signature in production only
- Persistence (`lib/db/*`)
  - Node Postgres pool; mandatory `DATABASE_URL`
  - Repositories: subscriptions (inline in `lib/db/index.ts`), audit (`lib/db/auditRepo.ts`), webhook idempotency (`lib/db/webhookRepo.ts`)
- Access Control (`lib/access/*`)
  - `policy.ts` derives effective tier: visitor | free | premium
  - `subscriptionState.ts` resolves a unified state per request
- Logging & Audit
  - JSON logging (`lib/logging/log.ts`)
  - Audit append + recent via DB repo (`lib/logging/audit.ts`)
- Tests (Vitest)
  - Contract, integration, unit; unified config `vitest.config.ts`

## 2) Data model

- subscriptions
  - user_id (PK, text)
  - tier: 'free' | 'premium'
  - status: 'active' | 'canceled' | 'none'
  - current_period_end timestamptz
  - cancellation_scheduled_at timestamptz
  - canceled_at timestamptz
  - updated_at timestamptz default now()

- audit_events
  - id uuid PK default gen_random_uuid()
  - ts timestamptz default now()
  - actor text (nullable)
  - type text not null
  - payload jsonb (nullable)

- webhook_events
  - id text PK
  - type text not null
  - processed_at timestamptz default now()
  - user_id text (nullable)
  - duplicate boolean default false

Schema source: `db/init.sql`. Apply with `npm run db:schema` (reads `.env.local`) or via `psql` directly.

## 3) Environment config

Required at runtime:
- NEXT_PUBLIC_SITE_URL
- DATABASE_URL
- NEXTAUTH_SECRET

Stripe (optional until enabled):
- NEXT_PUBLIC_STRIPE_PUBLIC_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- PREMIUM_PLAN_PRICE_ID
- BILLING_PORTAL_RETURN_URL (validated only when Stripe is configured)

Loader: `lib/config.ts` (standard strict TS defaults).

## 4) Auth + session resolution

- Primary helper: `lib/auth/session.ts#getServerAuthSession(req)` returns `{ userId, email?, role? } | null` using NextAuth's `getServerSession`.
- Resolution order:
  1. Authorization: Bearer token
    - Dev shortcut: `Bearer test:<userId>` in non-production (disabled in prod)
  2. NextAuth session via `getServerSession`
  - Logs `auth_session.*` for observability.

## 5) Subscription state

- `lib/access/subscriptionState.ts#deriveSubscriptionStateAsync(req)` returns:
  - `{ authenticated, tier, rawSession, subscription? }`
  - Honors mock headers for tests/dev: `x-user-id`, `x-user-premium: true|false`
  - If no mock headers: uses `getServerAuthSession(req)` and DB-backed subscription via `lib/subscriptions/store.ts`
  - `tier` derived via `getEffectiveTier(session)` from `lib/access/policy.ts`

## 6) Subscriptions API

- POST `/api/subscriptions/checkout`
  - Requires auth
  - If premium already: 400 error envelope `ALREADY_PREMIUM`
  - If Stripe not configured: 503 error envelope `STRIPE_NOT_CONFIGURED`
  - Else: returns ok envelope with `{ id, url }`
  - Audit events: `subscription.checkout.denied` (reasons), `subscription.checkout.requested`

- POST `/api/subscriptions/portal`
  - If Stripe not configured: 503 error envelope
  - Requires premium for access; otherwise 403 error envelope `NOT_PREMIUM`
  - Else: returns ok envelope with `{ id, url }`
  - Audit events: `subscription.portal.denied`, `subscription.portal.requested`

## 7) Stripe integration

- `lib/stripe/checkout.ts#createCheckoutSession(userId, priceId?)`
  - Dev/non-prod: returns mock `{ id: cs_test_*, url: <site>/mock/checkout }`
  - Prod: uses Stripe SDK with mode=subscription
- `lib/stripe/portal.ts#createPortalSession(userId, customerId?)`
  - Dev/non-prod: returns mock `{ id: bps_test_*, url: <site>/mock/portal }`
  - Prod: uses Stripe SDK billing portal; `return_url` from config

## 8) Webhooks

- POST `/api/webhooks/stripe`
  - Non-prod: parse JSON body without verifying signature
  - Prod: verify with `STRIPE_WEBHOOK_SECRET`
  - Idempotency: `webhook_events` table with `duplicate` behavior; duplicates return `{ ignored: true }`
  - Handles events:
    - `checkout.session.completed`: audit `checkout.completed`
    - `customer.subscription.created/updated`: upgrade to premium
    - `customer.subscription.deleted`: schedule + apply cancellation
    - Unhandled types audited as `webhook.unhandled` and ignored

## 9) Subscriptions store (DB-backed)

- `lib/subscriptions/store.ts` uses `lib/db.getSubscriptionsRepo()` for operations:
  - `upgradeToPremiumAsync(userId)`
  - `scheduleCancellationAsync(userId, when)`
  - `applyCancellationIfDueAsync(userId, now)`
  - `getSubscriptionAsync(userId)`
- Repo is implemented in `lib/db/index.ts` with a shared `pg` pool and a serialized query mode for tests.

## 10) Audit logging

- `lib/logging/audit.ts#recordAudit(type, details)`
  - Appends to `audit_events` via repo; returns the event shape for in-process use
  - `actor` optional; include when known
- `lib/db/auditRepo.ts`
  - `append` and `recent(limit)` with safe JSON parsing

## 11) Logging

- `lib/logging/log.ts` emits JSON lines with level, msg, time, and optional context
- Child contexts supported via `.child()`
- Tests assert schema via unit tests

## 12) Testing

- Vitest projects (node and jsdom) via `vitest.config.ts`
- Contract tests verify response envelopes and error codes
- Integration tests exercise flows (upgrade & webhook idempotency)
- Unit tests cover logging and config behavior
- Tests run green with DB emulation; in CI/local, you can run against a real Postgres by setting `DATABASE_URL`

## 13) Environment and ops

- `SERIALIZE_DB_QUERIES=1` can be set to serialize DB calls in tests for deterministic runs

## 14) Defaults and simplicity

- TypeScript uses standard strict defaults (no extra strict flags)
- Billing is optional to start; routes return explicit `STRIPE_NOT_CONFIGURED` until keys are real
- Dev-only bearer shortcut for tests/local (`Authorization: Bearer test:<userId>`) disabled in production
- Single unified Vitest config and minimal ESLint setup

## 15) Future work (optional ideas)

- Map Stripe customer to internal user id for webhooks
- Persist richer audit payloads and expose an admin feed
- Add CI workflow for typecheck/lint/tests
- Add feature flag scaffolding and quotas
  
