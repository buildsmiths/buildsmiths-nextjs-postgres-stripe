# Changelog

Single entry for the v1.0.0 release of the Next.js + Postgres + Auth.js + Stripe starter kit.

## [1.0.0] - 2025-10-12

This is the first stable release focused on a small, production‑lean foundation.

Highlights
- DB required from day one: the app fails fast if `DATABASE_URL` is missing. Schema lives in `db/init.sql` and is applied via `npm run db:schema` or `psql`.
- Persistence consolidated under `lib/db/*`: subscriptions, webhook idempotency, and audit events are DB‑backed.
- Stripe optionality: routes are safe with placeholder keys (return `stripe_not_configured`); real checkout/portal work when keys are set.
- Webhooks: idempotent processing backed by `webhook_events`; audit trail via `audit_events`.
- Tests: lean Vitest suite (~20 tests) using a single config (`vitest.config.ts`). Tests emulate Postgres with an in‑memory engine and serialize queries for determinism.
- Docs: README is the primary runbook; specs updated to reflect DB‑required stance; simple phased cleanup tasks included.
- DX: minimal scripts for DB schema/seed and a lean project layout with clear extension seams.

Breaking changes
- Postgres is mandatory in all environments; legacy in‑memory runtime stores were removed.
- Legacy `lib/persistence/*` was removed in favor of `lib/db/*`.

Getting started
1) Set `DATABASE_URL` and apply the schema: `psql "$DATABASE_URL" -f db/init.sql`
2) Set `NEXTAUTH_SECRET`; Stripe keys can remain placeholders while you start
3) `npm run dev` to develop; `npm test` runs the core suite

