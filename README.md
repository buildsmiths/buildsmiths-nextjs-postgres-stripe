<div align="center">

# Buildsmiths Starter (v1)

Craft a subscription-ready SaaS fast: Next.js 15 (App Router) · Postgres · Auth.js (credentials) · optional Stripe · Tailwind v4 · Vitest · JSON logs + audit hooks.

<sub>Minimal by design. Start with billing disabled, enable Stripe when ready. Postgres is required; tests run locally without live Stripe.</sub>

<br />
<img src="public/screenshot.png" alt="App homepage screenshot" width="800" />

</div>

## What you get
- Auth-first flow with Auth.js Credentials (email + password) and a built-in register endpoint
- Tier gating: free vs premium with a simple guard component and server helpers
- Billing optionality: runs with placeholder Stripe keys; real checkout/portal only when configured
- DB-backed webhook lifecycle and idempotency seam
- Structured logs and audit events for key actions
- Tests via Vitest: contract/integration/unit
- Database persistence is required. A one-shot bootstrap SQL is included.

---

## Quickstart (5 minutes)
1) Install and set env

```bash
git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git
cd buildsmiths-nextjs-postgres-stripe
npm install
cp .env.example .env.local
```

2) Fill required env in `.env.local`:
- NEXT_PUBLIC_SITE_URL (http://localhost:3000 for local)
- DATABASE_URL (Postgres connection string)
- NEXTAUTH_SECRET (any strong random string)

Stripe keys in the example are safe placeholders; billing stays disabled until you add real keys.

3) Apply the database schema (idempotent; safe to re-run)

Option A — use your .env.local directly:
```bash
npm run db:schema
```

Note on env precedence for `db:schema`:
- Shell environment > `.env.local` (non-empty values) > `.env` (non-empty values)
- Empty assignments in `.env.local` do not mask values from `.env`.
This ensures a default in `.env` still works if `.env.local` omits or leaves a variable empty.

Option B — with psql and an exported DATABASE_URL:
```bash
psql "$DATABASE_URL" -f db/init.sql
```

4) Run the app

```bash
npm run dev
```

Visit http://localhost:3000, click Sign In, and either:
- Register a new account (email + password), then sign in
- Or sign in if you already registered

5) Run tests

```bash
npm test           # single run
npm run test:watch # watch mode
```

---

## Setup guide (step-by-step)

This is a complete path from a fresh clone to a deployed app.

1) Prerequisites
- Node 22+ and npm
- A Postgres database (hosted or local)
- A strong secret for Auth.js sessions

Note: If you use nvm, you can pin a version with the provided `.nvmrc`.

2) Create a database (pick one)
- Hosted Postgres: Use any managed Postgres provider; create a database and copy the connection string.
- Local Postgres: Start a local instance and create a database.

3) Configure environment
```bash
cp .env.example .env.local
```
Fill the required variables:
- NEXT_PUBLIC_SITE_URL (e.g., http://localhost:3000 for local)
- DATABASE_URL (your Postgres connection string)
- NEXTAUTH_SECRET (use a strong random string)

Generate a strong NEXTAUTH_SECRET (either works):
```bash
# Node crypto
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or OpenSSL
openssl rand -base64 32
```

Production-only recommendations:
- ENFORCE_HTTPS=true
- Do not set ALLOW_DEV_BEARER_SHORTCUT in production.

Optional but recommended:
- Set NEXTAUTH_URL to the same value as NEXT_PUBLIC_SITE_URL if you see Auth.js warnings locally or in CI. At runtime the app infers NEXTAUTH_URL from NEXT_PUBLIC_SITE_URL, so leaving it unset is fine.

4) Apply the database schema
```bash
psql "$DATABASE_URL" -f db/init.sql
```
This starter does not auto-migrate. Tables are created when you run the bootstrap script above. It’s idempotent and safe to run again.

Tip: `psql` reads the shell environment, not `.env.local`. The `db:schema` script reads `.env.local` for you. If you prefer raw psql, set `DATABASE_URL` in your shell or pass the URL inline.

- macOS/Linux (bash):
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
psql "$DATABASE_URL" -f db/init.sql
```

- Windows PowerShell:
```powershell
$env:DATABASE_URL = "postgresql://user:pass@host:5432/db?sslmode=require"
psql $env:DATABASE_URL -f db/init.sql
```

- Pass URL directly (any platform):
```bash
psql "postgresql://user:pass@host:5432/db?sslmode=require" -f db/init.sql
```

Verify tables:
```bash
psql "$DATABASE_URL" -c "\dt"
```

5) Install dependencies and run locally
```bash
npm install
npm run dev
```

6) Seed a dev user (optional)
```bash
# Optionally customize email/password
SEED_EMAIL=dev@example.com SEED_PASSWORD='Password123!' npm run db:seed
```

7) Verify locally
- GET /api/health returns { ok: true, time }
- Register and sign in at /auth, then check /account and /dashboard
- With placeholder Stripe keys, billing endpoints respond with stripe_not_configured

8) Tests and build
```bash
npm run typecheck
npm test
npm run build
```

9) Deploy
- Provision a Node 22+ environment on your platform of choice (any Node host, container platform, or PaaS).
- Set these environment variables in your runtime:
   - NEXT_PUBLIC_SITE_URL (your production URL)
   - NEXTAUTH_SECRET (new strong value for prod)
   - DATABASE_URL (production Postgres connection string)
   - ENFORCE_HTTPS=true
   - NEXTAUTH_URL (optional — set equal to NEXT_PUBLIC_SITE_URL)
   - Optional: Stripe keys when going beyond placeholder mode
- Apply the schema to your production database (one-time, idempotent):
```bash
psql "$DATABASE_URL" -f db/init.sql
```
- Build and run the app in your environment:
```bash
npm run build
npm start
```
- Verify `/api/health`, auth flows, and gated pages on your deployed URL.

10) Optional Stripe test-mode
- Replace placeholder Stripe keys with test keys.
- Verify checkout/portal flows and send a test webhook to /api/webhooks/stripe.

## Scripts
- dev: start Next.js dev server
- build / start: production build and run
- typecheck: TypeScript check
- test / test:watch: run tests (single run or watch)
- db:schema: apply `db/init.sql` using `.env.local`'s DATABASE_URL
- db:seed: seed a dev user (optional)

---

## Project structure
```
app/               # App Router pages, API routes (includes /api/auth for Auth.js)
components/        # UI components (AuthButton, SignInPanel, etc.)
lib/               # Config, auth helpers, access policy, persistence, stripe, logging, audit
lib/access/        # Tier policy + subscription state derivation
lib/subscriptions/ # Subscription store facade (upgrade/cancel lifecycle)
db/                # Bootstrap SQL (tables for users/subscriptions/audit/webhooks)
specs/             # Specs & docs used to drive implementation
tests/             # Contract, integration, unit tests
```

---

## Environment variables
Authoritative source: `.env.example` and loader `lib/config.ts`.

Required:
- NEXT_PUBLIC_SITE_URL
- DATABASE_URL
- NEXTAUTH_SECRET

Notes:
- You don’t need any Stripe keys to run locally; billing stays safely disabled.
- DATABASE_URL is required everywhere; the app errors clearly if missing.

---

## Auth setup (Auth.js Credentials)
No OAuth required. Built-in endpoints:
- POST /api/auth/register — create a user (email + password)
- GET/POST /api/auth/[...nextauth] — Auth.js routes for credentials sign in

Make sure `NEXTAUTH_SECRET` is set. In development you can generate one with, for example, Node’s crypto module.

---

## Stripe setup (optional)
You can build without Stripe. When ready:
1) Add the following env vars in `.env.local`:
   - NEXT_PUBLIC_STRIPE_PUBLIC_KEY
   - STRIPE_SECRET_KEY
   - PREMIUM_PLAN_PRICE_ID
   - STRIPE_WEBHOOK_SECRET (used to verify webhooks in production)
   - BILLING_PORTAL_RETURN_URL (e.g., https://yourapp.com/account)
2) Restart the server. Checkout and billing portal endpoints return mock URLs in dev and use real Stripe in production.
3) Webhooks: send Stripe events to `/api/webhooks/stripe`. In dev, signature verification is skipped; in production it’s enforced.

---

## Database setup (required)
The app requires Postgres for subscriptions, webhook idempotency, and audit events.

Option A: Hosted Postgres (recommended to get started)
1) Create a database on your provider
2) Copy the connection string and set `DATABASE_URL` in `.env.local`
3) Apply schema:
```bash
psql "$DATABASE_URL" -f db/init.sql
```

Option B: Local Postgres
1) Start your local Postgres (via Docker or local install), then set DATABASE_URL and apply schema:
```bash
psql "$DATABASE_URL" -f db/init.sql
```
Creates tables: `users`, `subscriptions`, `audit_events`, `webhook_events`.

Run app/tests (DATABASE_URL must be set):
```bash
npm run dev
npm test
```

---

## Testing
- Contract tests validate API envelopes and semantics
- Integration tests cover flows (upgrade → webhook → gated feature)
- Unit tests exercise logic (policy, config)

Commands:
```bash
npm test
npm run test:watch
```

---

## Quick API calls (HTTP examples)
This repository doesn’t include ready-made HTTP request files. You can use any REST client (VS Code REST Client, Postman, curl) against your running app. A helpful tip is to export a SITE variable for local requests:

```bash
SITE=http://localhost:3000
```

---

## Seed a local dev user
You can seed a local user (and ensure a free subscription row) using:

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quickstart
psql "$DATABASE_URL" -f db/init.sql
npm run db:seed               # optional: set SEED_EMAIL/SEED_PASSWORD envs
```

Example:
```bash
SEED_EMAIL=dev@example.com SEED_PASSWORD='Password123!' npm run db:seed
```

---

## Observability
- Logs: JSON lines via `lib/logging/log.ts`
- Audit: `lib/logging/audit.ts` appends events (DB-backed when DATABASE_URL is set)
- Auth traces: `lib/auth/session.ts` emits debug logs (e.g., `auth_session.dev_bearer`)

- Health: GET `/api/health` returns `{ ok: true, time }`

Tail examples:
```bash
npm test -s 2>&1 | grep -E 'auth_session\.|dev_bearer_present_but_disabled'
npm run dev 2>&1 | grep -E 'auth_session\.|dev_bearer_present_but_disabled'
```

---

## Deploying
Any Node host works. Remember:
- Set `NEXT_PUBLIC_SITE_URL` to your deployed URL
- Provide `NEXTAUTH_SECRET`
- Configure Stripe keys when enabling real billing
- Production requires `DATABASE_URL`

---

## FAQ
- Do I need dotenv? Not for Next.js runtime; Next reads `.env.local` directly. We include a small `dotenv` dependency only for Node scripts like `scripts/db-apply.ts` to load `.env.local` outside Next. If you don’t use those scripts, you can remove `dotenv`.
- How do I format code? There’s no project-wide formatter configured. Use VS Code’s default formatter or add your preferred formatter locally.
- Where do config files live? Keep Next.js, Tailwind, PostCSS, and Vitest configs at the repo root unless you re‑wire scripts.
- When are the DB tables created? When you run `psql "$DATABASE_URL" -f db/init.sql`. The script is idempotent; re-run it any time (for a fresh database, or after changing DATABASE_URL).

---

## License
MIT — see `LICENSE`.
