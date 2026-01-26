'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { AI_CONTEXT_PROMPT } from '@/lib/aiContext';

export function CopyContextButton() {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(AI_CONTEXT_PROMPT);
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
