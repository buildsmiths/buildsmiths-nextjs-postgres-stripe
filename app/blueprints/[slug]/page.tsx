import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, FileText, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

import { CopyButton } from '@/components/dev-tools/CopyButton';

export async function generateStaticParams() {
    const blueprintsDir = path.join(process.cwd(), 'blueprints');
    const files = await fs.readdir(blueprintsDir);

    return files
        .filter(file => file.endsWith('.md'))
        .map(file => ({
            slug: file.replace('.md', ''),
        }));
}

export default async function BlueprintPage({ params }: PageProps) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'blueprints', `${slug}.md`);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        return (
            <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="-ml-2">
                        <Link href="/blueprints">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blueprints
                        </Link>
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">blueprints/{slug}.md</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground text-lg">
                        Copy this context into your AI agent (Cursor/Copilot) to implement this feature.
                    </p>
                </div>

                <Card className="border-2">
                    <div className="bg-muted/30 border-b px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span className="font-mono">{slug}.md</span>
                        </div>
                        <CopyButton content={content} label="Copy Context" className="h-7 text-xs" />
                    </div>
                    <div className="p-0 overflow-hidden bg-zinc-950 text-zinc-50">
                        <div className="overflow-x-auto p-6">
                            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {content}
                            </pre>
                        </div>
                    </div>
                </Card>
            </div>
        );
    } catch (error) {
        notFound();
    }
}
