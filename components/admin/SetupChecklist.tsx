import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { isStripeConfigured } from '@/lib/config';
import { query } from '@/lib/db/simple';

async function schemaPresent(): Promise<boolean> {
    try {
        const { rows } = await query<{ t: string | null }>(`select to_regclass('public.users') as t`);
        return Boolean(rows[0]?.t);
    } catch {
        return false;
    }
}

export async function SetupChecklist() {
    // 1. Database Check
    const hasDbUrl = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
    const hasSchema = await schemaPresent();

    // 2. Auth Check
    const hasAuthSecret = !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim());
    const hasGoogleAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    // 3. Billing Check (Stripe)
    const stripeConfigured = isStripeConfigured();
    const hasWebhookSecret = !!(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET.trim());

    // 4. AI Check
    const hasAIKey = !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim());

    // 5. General Env
    const hasSiteUrl = !!(process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim());

    const CheckItem = ({ label, status, subtext }: { label: string, status: 'ok' | 'error' | 'warning', subtext?: string }) => {
        let Icon = CheckCircle2;
        let color = "text-green-500";
        if (status === 'error') {
            Icon = XCircle;
            color = "text-red-500";
        } else if (status === 'warning') {
            Icon = AlertCircle;
            color = "text-yellow-500";
        }

        return (
            <div className="flex items-start gap-3 py-2 border-b last:border-0 border-muted">
                <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none text-foreground">{label}</p>
                    {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Config Checklist</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                        {process.env.NODE_ENV}
                    </Badge>
                </div>
                <CardDescription>
                    Status of your local environment variables and database.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <CheckItem
                        label="Database Connection"
                        status={hasDbUrl && hasSchema ? 'ok' : 'error'}
                        subtext={!hasDbUrl ? "DATABASE_URL missing" : !hasSchema ? "Schema not pushed (run db:schema)" : "Connected to Postgres"}
                    />
                    <CheckItem
                        label="Authentication"
                        status={hasAuthSecret ? 'ok' : 'error'}
                        subtext={hasAuthSecret ? (hasGoogleAuth ? "Auth Secret & Google Provider Set" : "Auth Secret Set (Credentials Only)") : "NEXTAUTH_SECRET missing"}
                    />
                    <CheckItem
                        label="Site URL"
                        status={hasSiteUrl ? 'ok' : 'warning'}
                        subtext={hasSiteUrl ? process.env.NEXT_PUBLIC_SITE_URL : "NEXT_PUBLIC_SITE_URL missing (using default)"}
                    />
                    <CheckItem
                        label="Stripe Billing"
                        status={stripeConfigured ? 'ok' : 'warning'}
                        subtext={stripeConfigured ? (hasWebhookSecret ? "Keys & Webhook Set" : "Keys Set, Webhook Secret Missing") : "Stripe keys missing (billing disabled)"}
                    />
                    <CheckItem
                        label="AI Integration"
                        status={hasAIKey ? 'ok' : 'warning'}
                        subtext={hasAIKey ? "OpenRouter/AI Key Set" : "OPENROUTER_API_KEY optional"}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
