import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Check, Terminal, Zap, BookOpen } from "lucide-react"

export default function Landing() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-16 space-y-24">
            {/* Hero */}
            <section className="space-y-6 text-center pt-8">
                <Badge variant="secondary" className="mb-4">v2.0 Now Available</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground/90">
                    The <span className="text-primary">AI-Native</span> SaaS Starter
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                    A minimalist Foundation for 2026. Next.js 15, Server Actions, and a unique <strong>Blueprint Architecture</strong> designed for AI code generation.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <Button asChild size="lg" className="h-12 px-8 text-base">
                        <a href="/dashboard">View Demo Dashboard</a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8">
                        <a href="https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe" target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg">Prompt-Driven Dev</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Don't fight boilerplate. Use our verified <strong>Blueprints</strong> to let Copilot implement complex features like Async Jobs and Stripe correctly.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg">Next.js 15 Core</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Built on the bleeding edge. Server Actions for mutations, Turbopack for speed, and React 19 patterns by default.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg">Self-Documenting</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The dashboard isn't just a UI; it's a live status board that checks your database and env, guiding you through setup.
                    </p>
                </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" aria-labelledby="quickstart-title" className="max-w-3xl mx-auto w-full">
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
