import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollText, Terminal, CreditCard, Sparkles, Server } from "lucide-react"

export const metadata = {
    title: 'Blueprints',
    description: 'Architecture specs for AI-driven development.'
};

const blueprints = [
    {
        title: "AI SDK Integration",
        file: "blueprints/features/ai-sdk.md",
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
        file: "blueprints/features/async-jobs.md",
        icon: Server,
        description: "Reliable, zero-dependency asynchronous job queue using the existing Postgres database.",
        objectives: [
            "Offload long-running tasks",
            "Persist jobs across restarts",
            "Simple retry logic"
        ]
    },
    {
        title: "Stripe Billing",
        file: "blueprints/features/billing-stripe.md",
        icon: CreditCard,
        description: "Robust recurring subscription system using Stripe Checkout and Customer Portal.",
        objectives: [
            "Free to Premium upgrades",
            "Stripe Customer Portal",
            "Webhook synchronization"
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
                    <Card key={bp.file} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <bp.icon className="h-6 w-6" />
                                </div>
                                <Badge variant="outline" className="font-mono text-xs">
                                    .md
                                </Badge>
                            </div>
                            <CardTitle className="text-xl">{bp.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {bp.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="bg-muted/50 p-2 rounded text-xs font-mono text-muted-foreground break-all">
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
                        "Read <span className="text-blue-600">blueprints/features/async-jobs.md</span> and implement the job queue system.
                        Use the existing db/schema.sql patterns."
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
