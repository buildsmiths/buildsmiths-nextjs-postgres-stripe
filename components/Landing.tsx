import React from 'react';

export default function Landing() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
            {/* Hero */}
            <section className="space-y-5 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    BuildSmiths StarterKit
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Subscription‑ready SaaS starter: Next.js 15 (App Router) · Postgres · Auth.js (credentials) · optional Stripe · Tailwind v4 · Vitest · JSON logs + audit hooks.
                    Minimal by design. Start with billing disabled, enable Stripe when ready. Postgres is required.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <a href="/auth" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Sign in
                    </a>
                    <a href="#quickstart" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                        Quickstart
                    </a>
                    <a href="https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                        View on GitHub
                    </a>
                </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" aria-labelledby="quickstart-title" className="rounded-lg border bg-white p-6 dark:bg-gray-900 dark:border-gray-800">
                <h2 id="quickstart-title" className="text-xl font-semibold">Quickstart (5 minutes)</h2>
                <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    <ol className="list-decimal pl-5 space-y-2 marker:text-gray-400">
                        <li>
                            Clone & install
                            <div className="mt-2 rounded-md bg-gray-900 text-gray-100 text-xs p-3 overflow-auto">
                                <pre className="whitespace-pre-wrap"><code>{`git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git
cd buildsmiths-nextjs-postgres-stripe
npm install
cp .env.example .env.local`}</code></pre>
                            </div>
                        </li>
                        <li>
                            Fill required env in <span className="font-mono">.env.local</span>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600 dark:text-gray-300">
                                <li><span className="font-mono">NEXT_PUBLIC_SITE_URL</span> (http://localhost:3000 for local)</li>
                                <li><span className="font-mono">DATABASE_URL</span> (Postgres connection string)</li>
                                <li><span className="font-mono">NEXTAUTH_SECRET</span> (strong random string)</li>
                            </ul>
                        </li>
                        <li>
                            Apply database schema (idempotent)
                            <div className="mt-2 rounded-md bg-gray-900 text-gray-100 text-xs p-3 overflow-auto">
                                <pre className="whitespace-pre-wrap"><code>{`npm run db:schema`}</code></pre>
                            </div>
                        </li>
                        <li>
                            Run the app
                            <div className="mt-2 rounded-md bg-gray-900 text-gray-100 text-xs p-3 overflow-auto">
                                <pre className="whitespace-pre-wrap"><code>{`npm run dev  # http://localhost:3000`}</code></pre>
                            </div>
                        </li>
                        <li>
                            Run tests
                            <div className="mt-2 rounded-md bg-gray-900 text-gray-100 text-xs p-3 overflow-auto">
                                <pre className="whitespace-pre-wrap"><code>{`npm test`}</code></pre>
                            </div>
                        </li>
                    </ol>
                </div>
            </section>
        </div>
    );
}
