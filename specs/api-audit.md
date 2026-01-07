# API Route Audit & Migration Plan

As part of the move to React Server Actions (Next.js 15+), we are auditing `app/api/` routes.

## Status Overview

| Route | Method | Purpose | Status | Action |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | User registration | **Migrated** | Delete Route. Logic moved to `app/auth/actions.ts`. |
| `/api/auth/[...nextauth]` | Any | Auth.js Handlers | **Keep** | Required for NextAuth v4. |
| `/api/auth/status` | GET | Session check (JSON) | **Keep** | Useful for external clients/debugging. |
| `/api/subscriptions/checkout` | POST | Stripe Checkout | **Migrated** | Delete Route. Logic moved to `app/billing/actions.ts`. |
| `/api/subscriptions/portal` | POST | Stripe Portal | **Migrated** | Delete Route. Logic moved to `app/billing/actions.ts`. |
| `/api/webhooks/stripe` | POST | Stripe Webhooks | **Keep** | Required for external integration. |
| `/api/feature/premium-example` | GET | Demo Gated Content | **Keep** | Good example of API authorization. |
| `/api/health` | GET | Health Check | **Keep** | Required for monitoring. |

## Migration Notes

### Auth (Register)
Moved to `registerAction` in `app/auth/actions.ts`. The client component `SignInPanel` now invokes the server action directly instead of `fetch`.

### Billing
Moved to `upgradeSubscription` and `manageSubscription` in `app/billing/actions.ts`. The `BillingPage` forms now use the `action={...}` prop.

### Sign Out
Currently handled by `next-auth/react` client-side `signOut()`. Migration to a Server Action is deferred until an upgrade to Auth.js v5, as v4 session cookie management is complex to replicate manually in a server action.
