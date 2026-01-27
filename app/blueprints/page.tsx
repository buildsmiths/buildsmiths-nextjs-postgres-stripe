import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { ScrollText, Terminal, CreditCard, Sparkles, Server, Shield, ArrowRight } from "lucide-react"

export const metadata = {
    title: 'Blueprints',
    description: 'Architecture specs for AI-driven development.'
};

const blueprints = [
    {
        title: "Stripe Billing",
        id: "billing-stripe",
        file: "blueprints/billing-stripe.md",
        icon: CreditCard,
        description: "Hybrid mock/real subscription system. Toggle keys to go from dev to prod.",
        objectives: [
            "Subscription table schema",
            "Checkout & Portal actions",
            "Webhook synchronization"
        ]
    },
    {
        title: "Google Authentication",
        id: "auth-google",
        file: "blueprints/auth-google.md",
        icon: Shield,
        description: "Activation pattern for production-ready OAuth with Google and NextAuth.js.",
        objectives: [
            "Environment configuration",
            "GCP Console setup",
            "Redirect URI mapping"
        ]
    },
    {
        title: "AI SDK Integration",
        id: "ai-sdk",
        file: "blueprints/ai-sdk.md",
        icon: Sparkles,
        description: "Standardized pattern for AI chat/completion integration using Vercel AI SDK and OpenRouter.",
        objectives: [
            "Streaming chat interfaces",
            "Model agnostic (Claude/GPT)",
            "Runtime key validation"
        ]
    },
    {
        title: "Async Jobs Queue",
        id: "async-jobs",
        file: "blueprints/async-jobs.md",
        icon: Server,
        description: "Reliable, zero-dependency asynchronous job queue using the existing Postgres database.",
        objectives: [
            "Offload long-running tasks",
            "Persist jobs across restarts",
            "Simple retry logic"
        ]
    }
];

export default function BlueprintsPage() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Architecture Specs</Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Feature Blueprints</h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    Don't rely on stale boilerplate. Use these Markdown specifications to guide your AI agent
                    in generating fresh, context-aware implementations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blueprints.map((bp) => (
                    <Link href={`/blueprints/${bp.id}`} key={bp.id} className="block h-full group">
                        <Card className="flex flex-col h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group-hover:bg-muted/5">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <bp.icon className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className="font-mono text-xs group-hover:border-primary/50">
                                        .md
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                                    {bp.title}
                                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {bp.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="bg-muted/50 p-2 rounded text-xs font-mono text-muted-foreground break-all group-hover:bg-background transition-colors border group-hover:border-input">
                                    {bp.file}
                                </div>
                                <ul className="space-y-2">
                                    {bp.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        How to use Blueprints
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Blueprints are "Prompt Engineering as Code". Instead of pasting code snippets,
                        tell your AI agent (Cursor, Copilot, etc) to read the spec file.
                    </p>
                    <div className="bg-background border rounded-lg p-4 font-mono text-sm text-foreground/80">
                        <span className="text-green-600"># Example Prompt</span><br />
                        "Read <span className="text-blue-600">blueprints/async-jobs.md</span> and implement the job queue system.
                        Use the existing db/schema.sql patterns."
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
