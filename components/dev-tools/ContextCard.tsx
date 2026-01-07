'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ContextCardProps {
    title: string;
    description: string;
    prompt: string;
    fileLocation?: string;
}

export function ContextCard({ title, description, prompt, fileLocation }: ContextCardProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        toast.success("Context copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-dashed border-primary/20 bg-muted/30">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <span>ℹ️ Developer Context</span>
                    </CardTitle>
                    {fileLocation && (
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                            {fileLocation}
                        </code>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h3 className="font-semibold text-foreground/90">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="relative group">
                    <pre className="text-xs bg-background/50 border rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground/80 max-h-32">
                        {prompt}
                    </pre>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Button already at footer, but duplication logic usually cleaner there */}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full gap-2 text-xs"
                    onClick={handleCopy}
                >
                    {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                    {copied ? 'Copied to Clipboard' : 'Copy AI Prompt'}
                </Button>
            </CardFooter>
        </Card>
    );
}
