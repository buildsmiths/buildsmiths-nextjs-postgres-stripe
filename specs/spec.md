# Project Spec

A concise spec for this base starter so you can understand the moving parts and extend it safely. Focused on correctness, minimalism, and portability.

## Stack and layout
- Next.js 16.1 (App Router, Turbopack)
  - Pages/UI in `app/`
  - Actions directly next to pages (e.g. `app/auth/actions.ts`)
- Auth.js (NextAuth) — Credentials provider (email + password), JWT sessions
- Postgres — required persistence (users, subscriptions, audit)
- Tailwind CSS v4 alongside `shadcn/ui` base components.

## Configuration
- Required env vars (runtime):
  - `NEXT_PUBLIC_SITE_URL`
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
- Loading behavior:
  - The app uses Next.js env loading (.env.local).
  - The `db:schema` script reads envs outside Next with precedence: Shell > .env.local (non-empty) > .env (non-empty).

## Data model (summary)
- `users`: id, email, password_hash
- `subscriptions`: user_id (FK -> users.id), tier ('free'|'premium'), status ('active'|'canceled'|'none'), period/cancellation timestamps
- `audit_events`: id, ts, actor?, type, payload?
Schema lives in `db/schema.sql` (idempotent setup).

## Auth and access
- Register: `app/auth/actions.ts` -> `registerAction()`
- Sign-in/out via NextAuth credentials at `/api/auth/[...nextauth]`
- Session resolution is JWT-based.

## Core App Features
- Health: `GET /api/health` → `{ ok: true, time }`
- Middleware Gating: `proxy.ts` strictly gates `/dashboard` and `/account`.
- Minimal Dashboard: Ready-to-go `app/dashboard/page.tsx` utilizing minimal database queries.

## Persistence
- Single connection pool instance located at `lib/db.ts`. Do not use heavy ORMs unless required via Blueprint.

## Blueprints
Optional integrations that can be added incrementally via `.md` specs:
- `blueprints/billing-stripe.md` -> Stripe payments and webhooks.
- `blueprints/auth-google.md` -> Google OAuth injection.

## Developer workflows
- Apply schema: `npm run db:schema` (reads `.env.local`) or `psql "$DATABASE_URL" -f db/schema.sql`
- Seed dev user: `npm run db:seed`
- Run: `npm run dev`
- Build: `npm run build`
- Typecheck: `npm run typecheck`

## Success criteria
- Health checks and core routes work locally with a real Postgres
- Auth register/sign-in flows succeed.
- Typecheck and production build pass without errors.
