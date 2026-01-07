import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Check, Terminal, Zap, BookOpen, Layers, Code2, Box, Github, ExternalLink } from "lucide-react"

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

            {/* Quickstart Content (Replaces Old Section) */}
            <section id="quickstart" aria-labelledby="quickstart-title" className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Get Started in 5 Minutes</h2>
                    <p className="text-muted-foreground">Everything you need to run locally is included.</p>
                </div>

                {/* Installation - Full Width */}
                <Card className="w-full border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Terminal className="h-6 w-6 text-primary" />
                            <span>Installation</span>
                        </CardTitle>
                        <CardDescription className="text-base">
                            Prerequisites: Node.js 18+ and a Postgres database (local or cloud).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold">1. Clone the Repository</h3>
                            </div>
                            <div className="bg-muted px-4 py-3 rounded-md overflow-x-auto border shadow-sm">
                                <pre className="text-sm font-mono text-foreground/90">
                                    {`git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git my-saas
cd my-saas`}
                                </pre>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-semibold">2. Install Dependencies</h3>
                            <div className="bg-muted px-4 py-3 rounded-md overflow-x-auto border shadow-sm">
                                <pre className="text-sm font-mono text-foreground/90">
                                    {`npm install
cp .env.example .env.local`}
                                </pre>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Edit <code>.env.local</code> to add your <code>DATABASE_URL</code> and <code>AUTH_SECRET</code>.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-semibold">3. Initialize Database</h3>
                            <div className="bg-muted px-4 py-3 rounded-md overflow-x-auto border shadow-sm">
                                <pre className="text-sm font-mono text-foreground/90">
                                    {`npm run db:schema  # Pushes schema to DB
npm run db:seed    # Optional: Adds test users`}
                                </pre>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-semibold">4. Start Development Server</h3>
                            <div className="bg-muted px-4 py-3 rounded-md overflow-x-auto border shadow-sm">
                                <pre className="text-sm font-mono text-foreground/90">
                                    {`npm run dev`}
                                </pre>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Grid - 3 Columns */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Included Features */}
                    <Card className="h-full border-muted-foreground/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Box className="h-5 w-5 text-primary" />
                                <span>What's Included</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span><strong>Auth.js v5</strong> (NextAuth) pre-configured security.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span><strong>Postgres Schema</strong> for Users & Subs.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span><strong>Stripe Integration</strong> (Optional).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span><strong>Dashboard UI</strong> (Shadcn/Tailwind).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span><strong>Vitest</strong> suite with in-memory DB.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Architecture / Tech Stack */}
                    <Card className="h-full border-muted-foreground/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                <span>Tech Stack</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-primary mt-0.5" />
                                    <span><strong>Next.js 15</strong> App Router</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-primary mt-0.5" />
                                    <span><strong>Postgres</strong> via pg driver</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-primary mt-0.5" />
                                    <span><strong>Tailwind v4</strong> + Shadcn</span>
                                </li>
                            </ul>
                            <div className="mt-8 pt-4 border-t">
                                <p className="text-xs text-muted-foreground mb-3">Explore the "Blueprints" pattern.</p>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <a href="/?scroll=blueprints">
                                        View Blueprints <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Source Code */}
                    <Card className="h-full border-muted-foreground/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-primary" />
                                <span>Source Code</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Open source and free to use. Licensed under MIT.
                            </p>
                            <div className="bg-muted/50 p-3 rounded text-xs font-mono mb-2">
                                buildsmiths/buildsmiths-nextjs-postgres-stripe
                            </div>
                            <Button className="w-full" asChild>
                                <a href="https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe" target="_blank" rel="noreferrer">
                                    <Github className="mr-2 h-4 w-4" />
                                    Star on GitHub
                                </a>
                            </Button>
                            <p className="text-xs text-muted-foreground text-center pt-2">
                                Contributions welcome!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Blueprint Showcase */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">The "Blueprint" Architecture</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We don't just give you code; we give you the <strong>instructions</strong> to build it with AI.
                        Found in <code>blueprints/features/</code>, these markdown specs are designed to be fed into Copilot or Cursor.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1: AI Integration */}
                    <div className="border rounded-xl p-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline">blueprints/features/ai-sdk.md</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Omni-Model AI Chat</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Standardized Vercel AI SDK setup using OpenRouter. Switch between Claude 3.5 and GPT-4o via env vars without touching code.
                        </p>
                        <div className="bg-background border rounded p-3 text-xs font-mono text-muted-foreground">
                            &gt; "Implement the AI SDK Blueprint. Install `ai` and `@ai-sdk/openai`..."
                        </div>
                    </div>

                    {/* Card 2: Async Jobs */}
                    <div className="border rounded-xl p-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline">blueprints/features/async-jobs.md</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Zero-Dependency Queue</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            A reliable Postgres-backed job queue for background tasks (emails, data processing) without adding Redis complexity.
                        </p>
                        <div className="bg-background border rounded p-3 text-xs font-mono text-muted-foreground">
                            &gt; "Implement the Async Jobs Blueprint. Create a migration SQL file..."
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
