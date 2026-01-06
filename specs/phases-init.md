# Project Setup Checklist

Lightweight, platform‑agnostic checklist to get the starter running locally and deployed anywhere.

Tip: Check items as you go. Use `[x]` for done, `[ ]` for pending.

## Prerequisites
- [ ] Node 22+ and npm installed
- [ ] A Postgres database (local or hosted)

## Local setup
- [ ] Clone the repo and install dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set required env vars in `.env.local`:
	- [ ] `NEXT_PUBLIC_SITE_URL` (e.g., http://localhost:3000)
	- [ ] `DATABASE_URL` (your Postgres connection string)
	- [ ] `NEXTAUTH_SECRET` (strong random string)
- [ ] Apply the database schema (idempotent)
	- [ ] `npm run db:schema` (uses `.env.local`), or
	- [ ] `psql "$DATABASE_URL" -f db/init.sql`
- [ ] (Optional) Seed a dev user: `npm run db:seed`
- [ ] Start the dev server: `npm run dev`
- [ ] Verify locally:
	- [ ] Visit `/` and `/auth`
	- [ ] Register/sign in → check `/account` and gated `/dashboard`
	- [ ] GET `/api/health` returns `{ ok: true, time }`

## Tests and quality
- [ ] Typecheck: `npm run typecheck`
- [ ] Tests: `npm test`
- [ ] Production build: `npm run build`

## Deploy (any platform)
- [ ] Provision a Node 22+ runtime
- [ ] Set environment variables in your platform:
	- [ ] `NEXT_PUBLIC_SITE_URL` (your production URL)
	- [ ] `NEXTAUTH_SECRET` (new strong value)
	- [ ] `DATABASE_URL` (production Postgres connection string)
	- [ ] `ENFORCE_HTTPS=true` (recommended for prod)
	- [ ] (Optional) Stripe vars when enabling real billing: `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PREMIUM_PLAN_PRICE_ID`, `BILLING_PORTAL_RETURN_URL`
- [ ] Apply schema to your production database:
	- [ ] `psql "$DATABASE_URL" -f db/init.sql`
- [ ] Build and run:
	- [ ] `npm run build`
	- [ ] `npm start`
- [ ] Verify `/api/health`, auth flows, and gated pages on your deployed URL

## Optional: Billing (Stripe)
- [ ] Replace placeholder keys with test/real keys
- [ ] Verify checkout and portal in test mode
- [ ] Send a test webhook to `/api/webhooks/stripe` and confirm subscription updates

## Maintenance / backlog (as needed)
- [ ] Backups/retention for Postgres
- [ ] Dependency updates
- [ ] Rate limiting and auth hardening
- [ ] Observability: logs, audit events, and basic metrics