# V1 Launch Checklist

Keep it simple. Only what’s needed to ship an app starter with auth, DB, and optional billing.

## What’s done
- [x] Database required (`DATABASE_URL` enforced); `db/init.sql` present; seed script wired.
- [x] Auth (Auth.js Credentials): register, sign in, JWT session, logout; `SessionProvider` wired.
- [x] Access gating for free vs premium; Stripe runs in placeholder mode by default.
- [x] Webhooks: basic handler + idempotency store; happy-path tests pass.
- [x] UI: Landing, Auth page, Dashboard, Account (user id/email), Billing link gated, Settings stub.
- [x] Quality gates: typecheck, lint, full tests, and production build green.
- [x] Minimal ops: `/api/health` endpoint and docs mention.
- [x] .env.example updated with required/optional keys aligned to README.
- [x] HTTP examples in `specs/http/` (auth, subscriptions, webhooks, health) and a DB seed script.
- [x] README Quickstart + deploy notes.

## Go‑live steps (you run these)
- [ ] Create a Postgres database (hosted or local) and grab the connection string.
- [ ] Apply schema: run `db/init.sql` against your database.
- [ ] Set environment variables in your runtime:
	- [ ] `DATABASE_URL` (from your DB provider)
	- [ ] `NEXTAUTH_SECRET` (generate a strong secret)
	- [ ] `NEXT_PUBLIC_SITE_URL` (your app base URL)
	- [ ] `ENFORCE_HTTPS=true` in production
	- [ ] Optional: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (or keep placeholders)
- [ ] Seed a dev user locally (optional): `npm run db:seed`.
- [ ] Start the app locally and verify:
	- [ ] GET `/api/health` returns `{ ok: true }`
	- [ ] Register/sign in on `/auth`, see `/account` details and gated `/dashboard`
	- [ ] Stripe routes return “stripe_not_configured” while placeholders are used
- [ ] Run checks locally: `npm run typecheck`, `npm test`, `npm run build`.
- [ ] Deploy (e.g., Vercel), set the same env vars, and verify health + basic navigation on the preview.

## Optional: Stripe test‑mode verification
- [ ] Replace placeholder Stripe keys with real test keys.
- [ ] Confirm checkout session creation and portal access succeed in test mode.
- [ ] Send a test webhook (Stripe CLI) and verify it reaches `/api/webhooks/stripe` and updates subscription state.

## Post‑launch backlog (do later, only if needed)
- [ ] Rate limiting for auth endpoints.
- [ ] OAuth providers (Google/GitHub) via Auth.js.
- [ ] Admin read‑only views for subscriptions/webhooks.
- [ ] Feature flags and a richer premium example.
- [ ] Extended webhook edge cases (trial→active, past_due, canceled).

## V1 acceptance
- [x] Single‑command dev startup, clear envs, DB schema applied.
- [x] Users can register/sign in, see gated pages, and run tests/build successfully.
- [x] Docs reflect the shipped stack (Next.js + Postgres + Auth.js; Stripe optional).