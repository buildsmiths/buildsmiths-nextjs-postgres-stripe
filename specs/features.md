# Application Features

This document provides a comprehensive list of all verified features in the application, organized by domain.

## 1. Authentication & ID Management
*   **Email/Password Registration**: Secure user creation via `POST /api/auth/register`.
*   **Credentials Sign-In**: Standard email/password login flow via NextAuth.
*   **Session Management**: JWT-based stateless sessions.
*   **Rate Limiting**:
    *   Registration: 5 requests per minute.
    *   Sign-In: 10 requests per minute.
*   **Protected Routes**: Middleware and component-level protection for authenticated pages.

## 2. Authorization & Access Control
*   **Tiered Permission System**: Supports `Visitor`, `Free`, and `Premium` user levels.
*   **Policy Enforcement**: Centralized `enforceTier()` logic to guard resources.
*   **Feature Gating**:
    *   **API Level**: `GET /api/feature/premium-example` demonstrates backend blocking.
    *   **UI Level**: `TierGuard` component for conditional rendering based on plan.
*   **Subscription State**: Dynamic derivation of user access rights from DB status.

## 3. Billing & Subscriptions (Stripe)
*   **Dual-Mode Operation**:
    *   **Dev/Test**: Mocks all Stripe calls internally (custom mock ID generation).
    *   **Production**: Full integration with real Stripe API.
*   **Checkout Workflow**: `POST /api/subscriptions/checkout` creates Stripe Sessions.
*   **Customer Portal**: `POST /api/subscriptions/portal` links to Stripe billing management.
*   **Subscription Lifecycle**: Handles statuses (`active`, `canceled`, `none`) and cancellation dates.
*   **Webhook Handling**:
    *   Dedicated endpoint `POST /api/webhooks/stripe`.
    *   Signature verification (in production).
    *   Idempotency layer using `webhook_events` table to prevent duplicate processing.

## 4. User Interface (UI/UX)
*   **Dashboard**: Authenticated landing page showing user tier and status.
*   **Account Settings**: Profile overview page.
*   **Billing Page**: Plan management interface with upgrade/portal links.
*   **Dev/Test Indicators**: Visual "chips" indicating when running in Dev or Mock APIs.
*   **Responsive Design**: Built with Tailwind CSS v4.
*   **Theme Support**: Dark/Light mode toggling.

## 5. Database & Persistence (Postgres)
*   **Core Tables**:
    *   `users`: Stores credentials and identity.
    *   `subscriptions`: Tracks plan status and periods.
    *   `audit_events`: Append-only log of system actions.
    *   `webhook_events`: Tracks processed hooks for idempotency.
*   **Migration Strategy**: Idempotent SQL scripts (`init.sql`) for safe schema application.
*   **Seeding**: Scripts to populate development data (`npm run db:seed`).

## 6. Operations & Observability
*   **Health Check**: `GET /api/health` for uptime monitoring.
*   **Audit Logging**: Database-backed recording of security and access events (`feature.access.denied`, etc.).
*   **JSON Logger**: Structured logging system for application events.

## 7. Developer Experience & Testing
*   **Vitest Integration**: Native test runner support.
*   **Testing Layers**:
    *   **Unit**: Logic isolation.
    *   **Integration**: Flow testing.
    *   **Contract**: API surface verification.
*   **In-Memory Database**: Runtime patching with `pg-mem` for fast, dependency-free testing.
*   **Environment Management**: Hierarchical loading (`.env`, `.env.local`) with type-safe config access.
