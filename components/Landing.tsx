import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Landing() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
            {/* Hero */}
            <section className="space-y-5 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    BuildSmiths StarterKit
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Subscription‑ready SaaS starter: Next.js 15 (App Router) · Postgres · Auth.js (credentials) · optional Stripe · Tailwind v4 · Vitest · JSON logs + audit hooks.
                    Minimal by design. Start with billing disabled, enable Stripe when ready. Postgres is required.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild size="lg">
                        <a href="/auth">Sign in</a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="#quickstart">Quickstart</a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe" target="_blank" rel="noreferrer">
                            View on GitHub
                        </a>
                    </Button>
                </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" aria-labelledby="quickstart-title">
                <Card>
                    <CardHeader>
                        <CardTitle id="quickstart-title">Quickstart (5 minutes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <ol className="list-decimal pl-5 space-y-2 marker:text-muted-foreground">
                                <li>
                                    Clone & install
                                    <div className="mt-2 rounded-md bg-muted p-3 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-foreground"><code>{`git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git
cd buildsmiths-nextjs-postgres-stripe
npm install
cp .env.example .env.local`}</code></pre>
                                    </div>
                                </li>
                                <li>
                                    Fill required env in <span className="font-mono text-foreground">.env.local</span>
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li><span className="font-mono text-foreground">NEXT_PUBLIC_SITE_URL</span> (http://localhost:3000 for local)</li>
                                        <li><span className="font-mono text-foreground">DATABASE_URL</span> (Postgres connection string)</li>
                                        <li><span className="font-mono text-foreground">NEXTAUTH_SECRET</span> (strong random string)</li>
                                    </ul>
                                </li>
                                <li>
                                    Apply database schema (idempotent)
                                    <div className="mt-2 rounded-md bg-muted p-3 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-foreground"><code>{`npm run db:schema`}</code></pre>
                                    </div>
                                </li>
                                <li>
                                    Run the app
                                    <div className="mt-2 rounded-md bg-muted p-3 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-foreground"><code>{`npm run dev  # http://localhost:3000`}</code></pre>
                                    </div>
                                </li>
                                <li>
                                    Run tests
                                    <div className="mt-2 rounded-md bg-muted p-3 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-foreground"><code>{`npm test`}</code></pre>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
