import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Terminal, Layers, FolderTree } from "lucide-react"
import { CopyContextButton } from '@/components/dev-tools/CopyContextButton';

export const metadata = {
    title: 'Quickstart',
    description: 'Get up and running with the BuildSmiths StarterKit.'
};

export default function QuickstartPage() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <Card className="w-full border-2 shadow-sm">
                <CardHeader className="border-b bg-muted/20 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">Quickstart Guide</CardTitle>
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
                                <span className="text-foreground">SQL migrations (schema.sql)</span>
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
        </main>
    );
}
