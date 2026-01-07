import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Check, Terminal, Github, ExternalLink, Code2, Layers, Box } from "lucide-react"

export const metadata = {
    title: 'Quickstart',
    description: 'Get up and running with the BuildSmiths StarterKit in minutes.'
};

export default function QuickstartPage() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Developer Guide</Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Quickstart Guide</h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    You are currently viewing the live demo of the <strong>BuildSmiths StarterKit</strong>.
                    Follow these steps to deploy your own instance of this modern SaaS foundation.
                </p>
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
                            <p className="text-xs text-muted-foreground mb-3">Explore the "Blueprints" pattern for AI-native development.</p>
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
        </main>
    );
}
