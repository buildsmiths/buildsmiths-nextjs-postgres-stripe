# Buildsmiths Template Roadmap (V2)

Based on real-world usage in projects like *Norb Investigations* and *Gladibots*, this roadmap outlines the next evolution of the Buildsmiths template.

**Philosophy:** Maintain the "minimalist core" while adopting 2026 standards for Developer Experience (DX) and React architecture.

---

## 1. Foundation & Hygiene (The "Modern Defaults")

This phase groups smaller, high-value improvements to modernization the codebase's tooling and safety without changing the core feature set.

*   **Scripting Upgrade (`tsx`)**:
    *   **Action**: Adopt `tsx` to run `.ts` scripts directly.
    *   **Benefit**: Convert maintenance scripts (seed, schema apply) to TypeScript, sharing `lib/` code.
*   **Runtime Environment Validation**:
    *   **Action**: Create `lib/env.ts` using `zod` or manual checks to validate keys (Stripe, Auth, DB) **on startup**.
    *   **Benefit**: Fails fast with clear error messages instead of mysterious runtime crashes.
*   **TypeScript "Strict" Mode**:
    *   **Action**: Enable `noUncheckedIndexedAccess` in `tsconfig.json`.
    *   **Benefit**: Catches potential `undefined` errors in array/object access.
*   **CLI Utilities**:
    *   **Action**: Create `scripts/doctor.ts` for a "one-command" health check of your dev environment.

## 2. React Architecture: Server Actions

The template currently uses Route Handlers (`app/api/*`) for data mutation. Next.js 15+ and React 19 favor Server Actions for form submissions.

*   **Hybrid Approach**:
    *   **Keep**: `app/api/*` for external integrations (Webhooks, Mobile App APIs).
    *   **Migrate**: User-facing mutations (Sign Out, Update Profile, Cancel Subscription) to Server Actions (`app/actions/*`).
    *   **Why**: Removes client-side boilerplate and leverages React's progressive enhancement.

## 3. Database Layer (Generic & Robust)

We will stick to the standard `pg` driver to ensure the template works with **any** Postgres provider (Supabase, RDS, Railway, Local).

*   **Connection Resilience**:
    *   **Enhancement**: Update `db/index.ts` to explicitly configure the `pg.Pool` (connection timeouts, max clients).
    *   **Serverless Compat**: Add comments/docs explaining that for Vercel/Serverless deployments, the user should simply use their provider's "Transaction Pooler" connection string (port 6543) with the standard driver.
    *   **No Vendor Lock-in**: We will **not** default to `@neondatabase/serverless` to keep the template provider-agnostic.

## 4. Standardized Patterns (Managed via Blueprints)

To keep the core template lightweight, complex features will be defined as **Blueprints** (see Section 6) rather than hardcoded boilerplate.

*   **AI Core (Vercel AI SDK)**:
    *   **Goal**: Standardized `useChat` hooks and OpenRouter configuration.
    *   **Delivery**: Provided as a `blueprints/features/ai-sdk.md` spec.
*   **Async Job Queue**:
    *   **Goal**: Zero-dependency Postgres-backed job system (`jobs` table).
    *   **Delivery**: Provided as a `blueprints/features/async-jobs.md` spec.

## 5. The "Dev Showcase" Landing Page

Instead of a generic "Welcome" page, the dashboard (`/dashboard`) will serve as a live "Kitchen Sink" to demonstrate the template's capabilities immediately after spinning up.

*   **Component Strategy**:
    *   Interactive widgets (like "Job Trigger") will check if the feature is implemented.
    *   If missing, they will display a helpful "Apply Blueprint to Enable" state, pointing the developer to the specific prompt file.
*   **System Status Board**:
    *   Live indicators for:
        *   **Database**: Connection latency check.
        *   **Billing**: Current mode (Mock vs Real).
        *   **Auth**: Current session strength (Visitor vs User).

## 6. Context-Aware Developer Guidance (AI Bridge)

To help developers learn the stack and leverage AI assistants, we will embed "Context Cards" on key pages.

*   **Per-Page Explanations**:
    *   **Billing Page**: Explains Test vs Live mode, Stripe Webhooks, and where the code lives (`lib/stripe/`).
    *   **Auth Page**: Explains the NextAuth flow and session management.
*   **"Copy Context" Button**:
    *   A utility button on these cards that copies a summarized, AI-friendly prompt to the clipboard.
    *   *Example Payload*: "Here is the schema for the `subscriptions` table and the `checkout.ts` logic. Help me add a 'trial period' feature..."
*   **Segregation & Clean-Up**:
    *   **Strategy**: All "Demo", "Showcase", and "Guidance" components must live in a dedicated folder (e.g., `components/dev-tools/`).
    *   **Zero-Cost**: These components should be easy to delete or disable via a single flag/environment variable so they don't pollute the production app.

## 7. The "Spec Blueprints" Architecture (Prompt-Driven Development)

We will pioneer a lightweight, "AI-First" extension strategy. Instead of shipping stale boilerplate code in hidden folders, we will ship **Architectural Prompts** (Specfiles) that guide the developer's AI to build features correctly.

*   **The Problem**: Static boilerplate rots. APIs change (Stripe v15 -> v16). Developers spend time refactoring boilerplate to match their style.
*   **The Solution**: Ship High-Fidelity Specs (`.md`) in `blueprints/`.
    *   **Structure**:
        *   `blueprints/features/billing-stripe.md`
        *   `blueprints/features/ai-sdk.md`
        *   `blueprints/features/async-jobs.md`
    *   **Content**: Each file contains:
        *   **Objective**: "Build a checkout session..."
        *   **Requirements**: "Handle `checkout.session.completed` webhook..."
        *   **Constraints**: "Use Zod for validation. Wrap in `try/catch`."
        *   **Security**: "Verify webhook signature using `STRIPE_WEBHOOK_SECRET`."
*   **Workflow**:
    1.  Dev opens `blueprints/features/billing-stripe.md`.
    2.  Dev hits "Add to Chat" (Cursor/Copilot).
    3.  Dev types: *"Implement this blueprint using strict TypeScript."*
    4.  AI generates fresh, context-aware code that fits the project perfectly.
*   **Future Scope**:
    *   Ability to fetch updated specs dynamically from a "Spec Stack" API, ensuring the prompts themselves are always up-to-date with library changes.

---

## Development Phases

### Phase 1: Foundation & Hygiene
*Focus: Tooling, Safety, and Configuration.*
- [x] **Install `tsx`**: Add to devDependencies.
- [x] **Migrate Scripts**: Convert `db:schema` and `db:seed` to TypeScript.
- [x] **Runtime Validation**: Create `lib/env.ts` (replacing `lib/config.ts`) that validates environment variables on startup.
- [x] **CLI Doctor**: Create `scripts/doctor.ts` to check DB connection, Stripe keys, and Auth secret health.
- [x] **Strict Types**: Enable `noUncheckedIndexedAccess` in `tsconfig.json`.

### Phase 2: Architecture Modernization
*Focus: Upgrading Core Patterns.*
- [x] **DB Resilience**: Update `db/index.ts` to configure `pg.Pool` with robust timeouts and limits.
- [x] **Server Actions**: Implement a pilot Server Action (e.g., "Upgrade to Premium") to establish the pattern in `app/billing/actions.ts`.
- [ ] **Refactor API Routes**: Audit `app/api/` and document which should remain API routes vs. move to Actions.

### Phase 3: The "Spec Blueprints" Engine
*Focus: Creating the prompt-driven extension system.*
- [x] **Scaffold**: Create `blueprints/features/` directory.
- [x] **Author Spec: AI SDK**: Write `blueprints/features/ai-sdk.md` defining the Vercel AI SDK + OpenRouter setup.
- [x] **Author Spec: Async Jobs**: Write `blueprints/features/async-jobs.md` defining the Postgres queue schema and worker.
- [x] **Author Spec: Billing**: Write `blueprints/features/billing-stripe.md` defining the advanced subscription flow.

### Phase 4: Developer Experience (Showcase)
*Focus: The "Kitchen Sink" Dashboard and Guidance.*
- [x] **Refactor Dev Tools**: Move `DevStatusChips`, `TierGuard`, and debug components into `components/dev-tools/`.
- [x] **Context Cards**: Create the "Copy Prompts" UI component for the Billing and Auth pages.
- [x] **Dashboard Showcase**:
    - [x] Create `app/dashboard/page.tsx` (or edit existing) to act as the central hub.
    - [x] Add "Job Trigger" widget (visualize queue state).
    - [x] Add "AI Quick Check" widget (verify OpenRouter).
    - [x] Add conditional logic to show "Apply Blueprint" if features are missing.

