# Project Spec

A concise spec for this starter so you can understand the moving parts and extend it safely. Focused on correctness, minimalism, and portability.

## Stack and layout
- Next.js 15 (App Router)
  - Pages/UI in `app/`
  - API routes in `app/api/*`
- Auth.js (NextAuth) — Credentials provider (email + password), JWT sessions
- Postgres — required persistence (users, subscriptions, audit, webhook idempotency)
- Stripe — optional; mocked in dev, real in production
- Tailwind CSS v4
- Vitest — contract, integration, unit tests

## Configuration
- Required env vars (runtime):
  - `NEXT_PUBLIC_SITE_URL`
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
- Stripe (only when enabling billing):
  - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PREMIUM_PLAN_PRICE_ID`, `BILLING_PORTAL_RETURN_URL`
- Loading behavior:
  - The app uses Next.js env loading (.env.local).
  - The `db:schema` script reads envs outside Next with precedence: Shell > .env.local (non-empty) > .env (non-empty). Empty .env.local values don’t mask .env.
- Source of truth: `.env.example` and loader `lib/config.ts`.

## Data model (summary)
- `users`: id, email, password_hash
- `subscriptions`: user_id (FK -> users.id), tier ('free'|'premium'), status ('active'|'canceled'|'none'), period/cancellation timestamps
- `audit_events`: id, ts, actor?, type, payload?
- `webhook_events`: id, type, processed_at, user_id?, duplicate
Schema lives in `db/schema.sql` (idempotent).

## Auth and access
- Register: `POST /api/auth/register` (email + password) - Rate limited (5 req/min)
- Sign-in/out via NextAuth credentials at `/api/auth/[...nextauth]` - POST rate limited (10 req/min)
- Session resolution is JWT-based.
- Access tiers via `lib/access/policy.ts`: visitor | free | premium
- Request-level subscription state via `lib/access/subscriptionState.ts`.

## Core API contracts
- Health: `GET /api/health` → `{ ok: true, time }`
- Auth status: `GET /api/auth/status` → envelope with user and tier
- Premium example: `GET /api/feature/premium-example` → gated; returns envelope or `NOT_PREMIUM`
- Subscriptions:
  - `POST /api/subscriptions/checkout` → 400 `ALREADY_PREMIUM`, 503 `STRIPE_NOT_CONFIGURED`, or `{ id, url }`
  - `POST /api/subscriptions/portal` → 403 `NOT_PREMIUM`, 503 `STRIPE_NOT_CONFIGURED`, or `{ id, url }`
- Webhooks (Stripe): `POST /api/webhooks/stripe`
  - Dev: JSON parsed, signature skip
  - Prod: signature verified, idempotency via `webhook_events`

## Stripe behavior
- Dev/non-prod: `lib/stripe/*` return mock IDs/URLs (no external calls)
- Prod: Uses Stripe SDK; return_url/read keys from config; webhook signature enforced

## Persistence and repos
- `lib/db/*` exposes query helpers and typed repos:
  - Audit: `lib/db/auditRepo.ts`
  - Webhook idempotency: `lib/db/webhookRepo.ts`
  - Subscription store facade: `lib/subscriptions/store.ts`

## Logging and audit
- JSON logs via `lib/logging/log.ts`
- Audit hooks via `lib/logging/audit.ts` with DB append/read

## Developer workflows
- Apply schema: `npm run db:schema` (reads `.env.local`) or `psql "$DATABASE_URL" -f db/schema.sql`
- Seed dev user: `npm run db:seed` (configurable with `SEED_EMAIL`, `SEED_PASSWORD`)
- Run: `npm run dev`
- Tests: `npm test`, watch: `npm run test:watch`
- Typecheck: `npm run typecheck`

## Testing approach
- Vitest projects: Node + jsdom (`vitest.config.ts`)
- In tests, `pg` is patched at runtime via `tests/setup/patch-pg.js` to use an in-memory Postgres (`pg-mem`). No module alias needed.
- Test setup files under `tests/setup/` configure env and testing-library

## Non-goals / boundaries
- No auto-migrations — you run the schema script
- Billing disabled by default — safe placeholders; enable with real keys
- Formatting not enforced — use your editor’s default or add a formatter locally

## Success criteria
- Health checks and core routes work locally with a real Postgres
- Auth register/sign-in flows succeed; tier gating behaves as expected
- Stripe endpoints return explicit envelopes in placeholder mode; real billing works when configured
- Tests, typecheck, and production build pass

