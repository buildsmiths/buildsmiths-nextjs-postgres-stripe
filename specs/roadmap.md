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

## 4. AI Core & Vercel AI SDK Integration

We will adopt the **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) as the standard abstraction layer. This is superior to a manual `lib/ai/client.ts` because it standardizes streaming, tool calling, and provider switching.

*   **Universal Provider (via OpenRouter)**:
    *   **Implementation**: Configure the `createOpenAI` provider to point to `https://openrouter.ai/api/v1` using `OPENROUTER_API_KEY`.
    *   **Benefit**: This one configuration allows developers to switch between OpenAI, Anthropic, Gemini, Mistral, and Llama models just by changing a model string (e.g., `google/gemini-2.0-flash-exp`) without changing code.
*   **Ready-to-Use Hooks**:
    *   **UI Integration**: Use `useChat` for instant streaming chat interfaces in the showcase.
    *   **Why**: Drastically reduces boilerplate code for handling stream chunks, loading states, and error parsing.
*   **Demo Flow**:
    *   **UI**: A simple "Ask AI" playground at `/app/ai-demo/page.tsx` utilizing `useChat`.
    *   **Components**: Minimal generic `ChatInput` and `MarkdownResponse` components.

## 6. Simple Postgres Job Queue (Async Framework)

To handle long-running AI tasks without timeouts, we introduce a minimal, native-Postgres queue system.

*   **Schema**: Add a `jobs` table (id, type, status, payload, result, created_at, processed_at).
*   **Workflow**:
    1.  UI calls Server Action -> Insert row into `jobs` (Status: 'pending').
    2.  Async Worker (triggered via recursive fetch or Cron) picks up 'pending' job.
    3.  Job completes -> Update `jobs` with result (Status: 'completed').
    4.  UI polls job ID for completion.
*   **Philosophy**: Start with Postgres (zero deps). Allow swapping for Upstash/Redis later if scale demands it.


## 7. The "Dev Showcase" Landing Page

Instead of a generic "Welcome" page, the dashboard (`/dashboard`) will serve as a live "Kitchen Sink" to demonstrate the template's capabilities immediately after spinning up.

*   **Integration**: Utilize the existing `DevStatusChips` and `TierGuard` components to create a unified view.
*   **Interactive Modules**:
    *   **Async Job Trigger**: A card with a "Start Background Task" button.
        *   **Visuals**: Progress steps showing `Queued` → `Processing` → `Completed`, proving the Postgres queue is active.
    *   **AI Quick-Check**: A mini chat input to verify the OpenRouter connection without leaving the dashboard.
*   **System Status Board**:
    *   Live indicators for:
        *   **Database**: Connection latency check.
        *   **Billing**: Current mode (Mock vs Real).
        *   **Auth**: Current session strength (Visitor vs User).

## 8. Context-Aware Developer Guidance (AI Bridge)

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

---

## Implementation Plan

1.  [ ] **Install `tsx`** and migrate existing scripts.
2.  [ ] **Create `scripts/doctor.ts`** to validate the environment.
3.  [ ] **Refactor `lib/config.ts`** into `lib/env.ts` with instant validation.
4.  [ ] **Add Server Action Example**: Re-implement "Update Profile" or "Sign Out" using a server action to demonstrate the pattern.
5.  [ ] **Implement `lib/ai/client.ts`** targeting OpenRouter.
6.  [ ] **Create `jobs` schema** and basic queue processing logic.
7.  [ ] **Refactor `DevStatusChips`** into a `components/dev-tools` directory.
8.  [ ] **Build `app/dashboard` Showcase** with Job Trigger, AI widgets, and Context Cards.

