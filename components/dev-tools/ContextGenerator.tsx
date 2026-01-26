'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Sparkles, CreditCard, Activity, Layers, Square, CheckSquare, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { AI_CONTEXT_PROMPT } from '@/lib/aiContext';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BLUEPRINTS = [
    {
        id: 'billing',
        name: 'Stripe Billing',
        path: 'blueprints/billing-stripe.md',
        icon: CreditCard,
        description: 'Subscription tiers and webhooks.'
    },
    {
        id: 'auth-google',
        name: 'Google Auth',
        path: 'blueprints/auth-google.md',
        icon: Shield,
        description: 'Production OAuth configuration.'
    },
    {
        id: 'ai',
        name: 'AI SDK',
        path: 'blueprints/ai-sdk.md',
        icon: Sparkles,
        description: 'Integration for LLM features.'
    },
    {
        id: 'jobs',
        name: 'Async Jobs',
        path: 'blueprints/async-jobs.md',
        icon: Activity,
        description: 'Background processing.'
    },
];

export function ContextGenerator() {
    const [selectedBlueprints, setSelectedBlueprints] = React.useState<string[]>([]);
    const [copied, setCopied] = React.useState(false);

    const toggleBlueprint = (id: string) => {
        setSelectedBlueprints(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const getGeneratedPrompt = () => {
        let prompt = AI_CONTEXT_PROMPT;

        if (selectedBlueprints.length > 0) {
            prompt += `\n\nI would like to implement the following features based on the blueprints provided:\n`;
            selectedBlueprints.forEach(id => {
                const bp = BLUEPRINTS.find(b => b.id === id);
                if (bp) {
                    prompt += `- ${bp.name} (${bp.path}): ${bp.description}\n`;
                }
            });
            prompt += `\nPlease check these files and suggest the implementation steps.`;
        } else {
            prompt += `\n\nPlease review the available blueprints in the 'blueprints/' folder and suggest an implementation plan, or we can build a custom feature.`;
        }

        return prompt;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getGeneratedPrompt());
        setCopied(true);
        toast.success("Context & Instructions copied");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">

            {/* Header / Intro */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-foreground">AI Context</h3>
                    <Button
                        onClick={handleCopy}
                        size="sm"
                        className={cn("gap-2 transition-all", copied ? "bg-green-600 hover:bg-green-700" : "")}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Context"}
                    </Button>
                </div>
                <div className="bg-muted/50 border rounded-lg p-4 text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                    {(AI_CONTEXT_PROMPT.split('Stack:')[0] ?? '').trim()}
                </div>
            </div>

            {/* Stack Items */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                    <Layers className="h-5 w-5 text-primary" />
                    Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">Next.js 16</div>
                    <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">Postgres (pg - raw SQL)</div>
                    <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">Tailwind v4</div>
                    <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">Shadcn UI</div>
                    <div className="bg-muted/50 border rounded px-3 py-2 text-sm font-medium">NextAuth v4</div>
                </div>
            </div>

            {/* Blueprints Selection */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Feature Blueprints (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {BLUEPRINTS.map((bp) => {
                        const isSelected = selectedBlueprints.includes(bp.id);
                        return (
                            <div
                                key={bp.id}
                                onClick={() => toggleBlueprint(bp.id)}
                                className={cn(
                                    "cursor-pointer group relative flex flex-col gap-2 p-4 rounded-lg border-2 transition-all duration-200",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-transparent bg-muted/50 hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <bp.icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                                    {isSelected
                                        ? <CheckSquare className="h-5 w-5 text-primary" />
                                        : <Square className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                    }
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{bp.name}</div>
                                    <div className="text-xs text-muted-foreground leading-tight mt-1">{bp.description}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
