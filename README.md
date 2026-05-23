<div align="center">

# BuildSmiths NextJS Base Starter

<br />

</div>

## What you get
- Auth-first flow with Auth.js Credentials (email + password) and a built-in server action for registration.
- Route gating and session strictness via Next.js Middleware (`proxy.ts`).
- Fully typed data interaction strictly backed by Drizzle ORM and PostgreSQL natively.
- No UI component lock-in — Just pure Tailwind CSS V4 and React 19.
- No unused heavy utility packages.

---

## Quickstart (5 minutes)
1) Install and set env

```bash
git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres.git
cd buildsmiths-nextjs-postgres
npm install
cp .env.example .env.local
```

2) Fill required env in `.env.local`:
- NEXT_PUBLIC_SITE_URL (http://localhost:3000 for local)
- DATABASE_URL (Postgres connection string)
- NEXTAUTH_SECRET (any strong random string)

3) Push the Drizzle database schema

```bash
npm run db:push
```
Reads `DATABASE_URL` from `.env.local`.

4) Run the app

```bash
npm run dev
```

Visit http://localhost:3000, click Sign In, and register an account.

---

## Setup guide

1) Prerequisites
- Node 22+ and npm
- A Postgres database (hosted or local)
- A strong secret for Auth.js sessions

2) Configure environment
```bash
cp .env.example .env.local
```

Generate a strong NEXTAUTH_SECRET (either works):
```bash
# Node crypto
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or OpenSSL
openssl rand -base64 32
```

3) Push the Drizzle database schema
```bash
npm run db:push
```
This starter uses Drizzle ORM to manage the database schema. The script pushes the current definitions in `db/schema.ts` to your configured `DATABASE_URL`.

4) Install dependencies and run locally
```bash
npm install
npm run dev
```

5) Seed a dev user (optional)
```bash
# Optionally customize email/password
npm run db:seed
```

6) Build
```bash
npm run typecheck
npm run build
```

## Blueprints (Features & Integrations)

This starter is intentionally lightweight. Instead of forcing UI libraries or bloated API integrations on you, it includes **Blueprints** which can be found in `blueprints/`. 
You can provide any generated Blueprint markdown directly to modern AI coding agents (such as GitHub Copilot, Cursor, or Aider) to quickly install well-tested features into this app context.

Example blueprints available:
- `billing-stripe.md` - Integrates Stripe Checkout, Webhooks, and Portal Sessions back into the app using a strict schema addition.
- `auth-google.md` - Injects Google OAuth correctly bridging with Auth.js.

## Structure
```
app/               # App Router pages, Server Actions
blueprints/        # AI spec documentation to instantly enable extensions securely
components/        # Lean UI layout wrappers (Tailwind only)
lib/               # Core configuration, auth handling, and Drizzle instances
scripts/           # Native Node scripts for Drizzle seeding without dotenv overhead
```
