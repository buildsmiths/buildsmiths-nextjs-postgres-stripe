'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function CopyContextButton() {
    const [copied, setCopied] = React.useState(false);

    const text = `I am acting as a developer using the BuildSmiths StarterKit.

Stack: Next.js 16, Postgres (pg - raw SQL, no ORM), Tailwind v4, Shadcn UI, NextAuth v4.

Installation Checkpoints I've completed:

git clone ...
npm install
Configured .env.local and Dockerized Postgres
npm run db:schema
npm run dev
Codebase structure:

app: Next.js App Router
blueprints: Feature specs (Markdown)
components: React components (actions in lib)
db: SQL migrations (schema.sql)
lib: Core logic (auth, db, stripe)
scripts: DB management scripts
tests: Vitest integration/unit tests
Please assist me with adding features...

What features shall we add?
I found three feature blueprints in your blueprints folder. Which one would you like to implement first?

Stripe Billing (billing-stripe.md) - Subscription tiers and webhooks.
AI SDK (ai-sdk.md) - Integration for LLM features.
Async Jobs (async-jobs.md) - Background processing.
Or we can build something completely custom!`;

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Context copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 h-8 text-xs font-medium text-muted-foreground hover:text-primary transition-all"
            onClick={handleCopy}
            title="Copy project context for ChatGPT/Claude"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5 mb-0.5 text-muted-foreground" />
                    <span>Copy Context for AI</span>
                </>
            )}
        </Button>
    );
}
