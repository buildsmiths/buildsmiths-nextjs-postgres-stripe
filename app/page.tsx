import React from 'react';
// Landing page intentionally avoids premium/upgrade cards to keep focus on onboarding.

export default function LandingPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
            {/* Hero */}
            <section className="space-y-5 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Subscription‑ready SaaS starter
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Next.js + Postgres + Auth.js + Stripe placeholder with envelope APIs, audit logging, and a lean, contract-first test suite.
                    Database required from day one; bring your own Postgres (hosted or local) and apply the schema.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <a href="/auth" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Sign in
                    </a>
                    <a href="#quickstart" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Quickstart
                    </a>
                    <a href="https://github.com/graham-fleming/speckit-buildsmiths" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        View on GitHub
                    </a>
                </div>
                {/* No upgrade prompt on the landing page (kept on /billing) */}
            </section>

            {/* Features grid */}
            <section className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-white p-5">
                    <h3 className="font-semibold">Auth & Tiering</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Auth.js (NextAuth) credentials with a simple session helper. Tier guards for “free” and “premium” make UI gating straightforward.
                    </p>
                </div>
                <div className="rounded-lg border bg-white p-5">
                    <h3 className="font-semibold">Stripe placeholder mode</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Checkout and portal routes return a structured <code className="font-mono">stripe_not_configured</code> until real keys are set. Upgrade UI stays disabled—safe by default.
                    </p>
                </div>
                <div className="rounded-lg border bg-white p-5">
                    <h3 className="font-semibold">Postgres-backed repos</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        The app requires a database. Set <code className="font-mono">DATABASE_URL</code> and apply <code className="font-mono">db/init.sql</code>. Tests use an in-memory Postgres.
                    </p>
                </div>
                <div className="rounded-lg border bg-white p-5">
                    <h3 className="font-semibold">Tests & envelopes</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Contract-first envelope responses, idempotent webhooks, and a lean test suite to keep changes safe.
                    </p>
                </div>
            </section>

            {/* How it works */}
            <section className="grid md:grid-cols-2 gap-6 items-stretch">
                <div className="rounded-lg border bg-white p-5 space-y-3 text-sm">
                    <h3 className="font-semibold">How it works</h3>
                    <ol className="list-decimal pl-5 space-y-1 marker:text-gray-400">
                        <li>Auth via Auth.js (email/password); dev-only bearer header supported in non‑prod</li>
                        <li>Tier gating helpers decide free vs premium surfaces</li>
                        <li>Billing routes are safe by default until Stripe keys are real</li>
                        <li>Provide <span className="font-mono">DATABASE_URL</span> and apply <span className="font-mono">db/init.sql</span> (DB is required)</li>
                    </ol>
                </div>
                <div className="rounded-lg border bg-white p-5 space-y-2 text-sm">
                    <h3 className="font-semibold">API envelope example</h3>
                    <div className="rounded-md bg-gray-900 text-gray-100 text-xs p-4 overflow-auto">
                        <pre className="whitespace-pre-wrap"><code>{`GET /api/auth/status -> {
  ok: true,
  data: { authenticated: false, tier: 'visitor' }
}`}</code></pre>
                    </div>
                    <p className="text-gray-600">All APIs return a consistent envelope for success and errors.</p>
                </div>
            </section>

            {/* Why this starter? */}
            <section className="rounded-lg border bg-white p-6">
                <h2 className="text-xl font-semibold">Why this starter?</h2>
                <ul className="mt-3 grid md:grid-cols-3 gap-3 text-sm text-gray-700">
                    <li className="rounded border p-3">
                        <div className="font-medium">Production concerns first</div>
                        <p className="mt-1 text-gray-600">Auth, envelopes, logs, audit, and RLS strategy—ready from day one.</p>
                    </li>
                    <li className="rounded border p-3">
                        <div className="font-medium">Safe billing posture</div>
                        <p className="mt-1 text-gray-600">Disabled until real Stripe keys; routes return <span className="font-mono">stripe_not_configured</span>.</p>
                    </li>
                    <li className="rounded border p-3">
                        <div className="font-medium">Progressive realism</div>
                        <p className="mt-1 text-gray-600">Start in-memory, switch on Postgres later without changing contracts.</p>
                    </li>
                </ul>
            </section>

            {/* Architecture snapshot */}
            <section className="rounded-lg border bg-white p-6">
                <h2 className="text-xl font-semibold">Architecture snapshot</h2>
                <div className="mt-3 rounded-md bg-gray-900 text-gray-100 text-xs p-4 overflow-auto">
                    <pre className="whitespace-pre"><code>{`[Browser]
   |                               Stripe (Checkout/Portal)
   v                                         |
Next.js (App Router)  <----------------------+
   |  API routes (/api/*)
   v
Repositories (Postgres via DATABASE_URL)
   |
   v
Postgres (db/init.sql)  +  Auth.js (NextAuth) for sessions`}</code></pre>
                </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" aria-labelledby="quickstart-title" className="rounded-lg border bg-white p-6">
                <h2 id="quickstart-title" className="text-xl font-semibold">Quickstart</h2>
                <div className="mt-3 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm text-gray-700">
                        <ol className="list-decimal pl-5 space-y-1 marker:text-gray-400">
                            <li>Copy <span className="font-mono">.env.example</span> to <span className="font-mono">.env.local</span></li>
                            <li>Set <span className="font-mono">DATABASE_URL</span> and <span className="font-mono">NEXTAUTH_SECRET</span></li>
                            <li>Apply the schema: <span className="font-mono">db/init.sql</span></li>
                            <li>Run the dev server and sign in (email/password)</li>
                        </ol>
                    </div>
                    <div className="rounded-md bg-gray-900 text-gray-100 text-xs p-4 overflow-auto">
                        <pre className="whitespace-pre-wrap">
                            <code>{`npm install
export DATABASE_URL=postgresql://user:pass@host:5432/db
export NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # any strong secret
psql "$DATABASE_URL" -f db/init.sql
npm run dev  # http://localhost:3000`}</code>
                        </pre>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a href="/dashboard" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">Open dashboard</a>
                    <a href="/account" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">Account</a>
                    <a href="/billing" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">Billing</a>
                </div>
            </section>
        </div>
    );
}
