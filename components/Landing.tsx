import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CopyContextButton } from '@/components/dev-tools/CopyContextButton';
import { Badge } from "@/components/ui/badge"
import { Check, Terminal, Zap, BookOpen, Layers, Code2, Box, Github, ExternalLink, FolderTree } from "lucide-react"

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
                    A minimalist Foundation for 2026. Next.js 16, Server Actions, and a unique <strong>Blueprint Architecture</strong> designed for AI code generation.
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

            {/* Quickstart Content (Replaces Old Section) */}
            <section id="quickstart" aria-labelledby="quickstart-title" className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Get Started in 5 Minutes</h2>
                    <p className="text-muted-foreground">Everything you need to run locally is included.</p>
                </div>

                {/* Project Context - Full Width */}
                <Card className="w-full border-2 shadow-sm">
                    <CardHeader className="border-b bg-muted/20 pb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">Project Context</CardTitle>
                                <CardDescription>
                                    Defines the environment for both you and your AI agent.
                                </CardDescription>
                            </div>
                            <CopyContextButton />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-10 pt-8">

                        {/* Section 1: Stack */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                                <Layers className="h-5 w-5 text-primary" />
                                Stack
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">
                                    Next.js 16
                                </div>
                                <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">
                                    Postgres (pg - raw SQL, no ORM)
                                </div>
                                <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">
                                    Tailwind v4
                                </div>
                                <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">
                                    Shadcn UI
                                </div>
                                <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">
                                    NextAuth v4
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Installation Checkpoints */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                                <Terminal className="h-5 w-5 text-primary" />
                                Installation Checkpoints
                            </h3>
                            <div className="bg-zinc-950 text-zinc-50 rounded-lg border shadow-sm overflow-hidden">
                                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                                    bash
                                </div>
                                <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
                                    {`# 1. Clone & Enter
git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git my-saas
cd my-saas

# 2. Install & Configure
npm install
cp .env.example .env.local

# 3. Initialize Database (ensure Postgres is running)
npm run db:schema
npm run db:seed    # Optional: Adds test users

# 4. Start Development
npm run dev`}
                                </pre>
                            </div>
                        </div>

                        {/* Section 3: Codebase Structure */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                                <FolderTree className="h-5 w-5 text-primary" />
                                Codebase Structure
                            </h3>
                            <div className="border rounded-lg divide-y text-sm">
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">app/</span>
                                    <span className="text-foreground">Next.js App Router (Pages & API)</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">blueprints/</span>
                                    <span className="text-foreground">Feature specs (Markdown)</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">components/</span>
                                    <span className="text-foreground">React components (UI & Logic)</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">db/</span>
                                    <span className="text-foreground">SQL migrations (init.sql)</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">lib/</span>
                                    <span className="text-foreground">Core access, auth, db, and stripe logic</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">scripts/</span>
                                    <span className="text-foreground">Database management scripts</span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] p-3 gap-2 hover:bg-muted/30 transition-colors">
                                    <span className="font-mono text-muted-foreground">tests/</span>
                                    <span className="text-foreground">Vitest integration/unit tests</span>
                                </div>
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
                                    <span><strong>NextAuth v4</strong> pre-configured security.</span>
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
                                    <span><strong>Next.js 16</strong> App Router</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-primary mt-0.5" />
                                    <span><strong>Postgres</strong> (Raw SQL, no ORM)</span>
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
