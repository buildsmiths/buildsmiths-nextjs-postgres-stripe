import React from 'react';
import { query } from '@/lib/db/simple';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContextCard } from './ContextCard';
import { env } from '@/lib/env';

async function checkJobsTable() {
    try {
        const { rows } = await query(`select to_regclass('public.jobs') as t`);
        return !!rows[0]?.t;
    } catch {
        return false;
    }
}

async function checkAiConfig() {
    // env.OPENROUTER_API_KEY is optional in the schema, so we check if it is truthy here
    return !!process.env.OPENROUTER_API_KEY;
}

export default async function BlueprintStatus() {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const hasJobs = await checkJobsTable();
    const hasAi = await checkAiConfig();

    return (
        <div className="space-y-6 pt-8 border-t">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Feature Blueprints</h2>
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">DEV MODE ONLY</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Async Jobs Card */}
                {hasJobs ? (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Async Jobs</CardTitle>
                            <Badge variant="default">Installed</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Active</div>
                            <p className="text-xs text-muted-foreground">
                                Worker infrastructure ready.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <ContextCard
                        title="Async Jobs"
                        description="Zero-dependency job queue backed by Postgres. Needed for background tasks."
                        fileLocation="blueprints/features/async-jobs.md"
                        prompt="Implement the Async Jobs Blueprint. Create a migration SQL file `db/migrations/001_jobs.sql`. Create `lib/jobs/client.ts` with an `enqueueJob(type, payload)` function. Create a `worker` script `scripts/worker.ts` that loops infinitely (with sleep) polling for pending jobs using `SKIP LOCKED`. Implement a sample job handler 'SEND_WELCOME_EMAIL'."
                    />
                )}

                {/* AI SDK Card */}
                {hasAi ? (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">AI Integration</CardTitle>
                            <Badge variant="default">Configured</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Ready</div>
                            <p className="text-xs text-muted-foreground">
                                Vercel AI SDK + OpenRouter.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <ContextCard
                        title="AI Integration"
                        description="Standardized chat interface using Vercel AI SDK and OpenRouter."
                        fileLocation="blueprints/features/ai-sdk.md"
                        prompt={`Implement the AI SDK Blueprint. Install \`ai\` and \`@ai-sdk/openai\`. Update \`lib/env.ts\` to require \`OPENROUTER_API_KEY\`. Create \`lib/ai/provider.ts\` to export a configured \`openrouter\` provider object using the base URL \`https://openrouter.ai/api/v1\`. Create \`app/api/chat/route.ts\` that uses \`streamText\` with the model \`deepseek/deepseek-chat\` (as a default example). Add a simple rate limit check.`}
                    />
                )}
            </div>
        </div>
    );
}
