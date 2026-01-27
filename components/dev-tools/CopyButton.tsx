'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
    content: string;
    label?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
}

export function CopyButton({ content, label = "Copy", variant = "outline", className }: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Content copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={handleCopy}
            className={className}
        >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied!" : label}
        </Button>
    );
}
