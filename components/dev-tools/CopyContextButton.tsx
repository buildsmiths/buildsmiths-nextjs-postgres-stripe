'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function CopyContextButton() {
    const [copied, setCopied] = React.useState(false);

    const text = `I am acting as a developer using the BuildSmiths StarterKit. 
    
Stack: Next.js 15, Postgres (pg), Tailwind v4, Shadcn UI, NextAuth v5.

Installation Checkpoints I've completed:
1. git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git
2. npm install
3. cp .env.example .env.local (Configured DATABASE_URL)
4. npm run db:schema
5. npm run dev

Codebase structure:
- app/: Next.js routes
- blueprints/: Feature specifications (Markdown)
- components/: React components
- db/: SQL migrations and init
- lib/: Core utilities (access, auth, db, stripe)

Please assist me with adding features to this codebase.`;

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
