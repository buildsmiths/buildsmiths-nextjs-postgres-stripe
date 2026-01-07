import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Check, Terminal, Github, ExternalLink } from "lucide-react"

export const metadata = {
    title: 'Quickstart',
    description: 'Get up and running with the BuildSmiths StarterKit in minutes.'
};

export default function QuickstartPage() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Developer Guide</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Quickstart Guide</h1>
                <p className="text-muted-foreground max-w-2xl">
                    You are currently viewing the live demo of the <strong>BuildSmiths StarterKit</strong>.
                    Follow these steps to deploy your own instance of this SaaS foundation.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-primary" />
                                <span>Installation</span>
                            </CardTitle>
                            <CardDescription>
                                Prerequisites: Node.js 18+ and a Postgres database (local or cloud).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">1. Clone the Repository</h3>
                                </div>
                                <div className="bg-muted p-4 rounded-md overflow-x-auto border">
                                    <pre className="text-sm text-foreground font-mono">
                                        {`git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git my-saas
cd my-saas`}
                                    </pre>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">2. Install Dependencies</h3>
                                <div className="bg-muted p-4 rounded-md overflow-x-auto border">
                                    <pre className="text-sm text-foreground font-mono">
                                        {`npm install
cp .env.example .env.local`}
                                    </pre>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Edit <code>.env.local</code> to add your <code>DATABASE_URL</code> and <code>AUTH_SECRET</code>.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">3. Initialize Database</h3>
                                <div className="bg-muted p-4 rounded-md overflow-x-auto border">
                                    <pre className="text-sm text-foreground font-mono">
                                        {`npm run db:schema  # Pushes schema to DB
npm run db:seed    # Optional: Adds test users`}
                                    </pre>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">4. Start Development Server</h3>
                                <div className="bg-muted p-4 rounded-md overflow-x-auto border">
                                    <pre className="text-sm text-foreground font-mono">
                                        {`npm run dev`}
                                    </pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Once running, you can sign in with the test accounts (if seeded) or register a new user.
                                The app includes a built-in doctor script to check your environment:
                            </p>
                            <div className="bg-muted p-2 rounded-md font-mono text-xs inline-block">
                                npm run doctor
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Source Code</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                The full source code is available on GitHub under the MIT license.
                            </p>
                            <Button className="w-full" asChild>
                                <a href="https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe" target="_blank" rel="noreferrer">
                                    <Github className="mr-2 h-4 w-4" />
                                    View on GitHub
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Architecture</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span><strong>Next.js 15</strong> App Router</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span><strong>Postgres</strong> via pg driver</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span><strong>Tailwind v4</strong> + Shadcn</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span><strong>Auth.js v5</strong> (NextAuth)</span>
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <a href="/?scroll=blueprints">
                                        View Blueprints <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
