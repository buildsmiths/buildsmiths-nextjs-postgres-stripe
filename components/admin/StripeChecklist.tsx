import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, CreditCard, ExternalLink } from "lucide-react"

export async function StripeChecklist() {
    // Check individual variables
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    const sk = process.env.STRIPE_SECRET_KEY;
    const wh = process.env.STRIPE_WEBHOOK_SECRET;
    const priceId = process.env.PREMIUM_PLAN_PRICE_ID;
    const returnUrl = process.env.BILLING_PORTAL_RETURN_URL;

    // Helper for validation
    const exists = (val: string | undefined) => !!(val && val.trim().length > 0);
    const isTestKey = (val: string | undefined) => val?.startsWith('pk_test_') || val?.startsWith('sk_test_');

    const CheckItem = ({ label, envName, val, isSecret = false }: { label: string, envName: string, val: string | undefined, isSecret?: boolean }) => {
        const isSet = exists(val);
        const Icon = isSet ? CheckCircle2 : XCircle;
        const color = isSet ? "text-green-500" : "text-muted-foreground/40";
        // If it's a key, check if it looks like a test key
        const isTest = isSet && (val?.includes('_test_') || isTestKey(val));

        return (
            <div className="flex items-center justify-between py-3 border-b last:border-0 border-muted">
                <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">{label}</p>
                        <p className="text-xs font-mono text-muted-foreground">{envName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isSet && isTest && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-yellow-500/10 text-yellow-600 border-yellow-200">TEST MODE</Badge>
                    )}
                    <code className="text-[10px] bg-muted px-2 py-1 rounded text-muted-foreground min-w-[80px] text-right">
                        {isSet ? (isSecret ? '••••••••' : (val!.length > 10 ? val!.substring(0, 10) + '...' : val)) : 'Not Set'}
                    </code>
                </div>
            </div>
        )
    }

    const allConfigured = exists(pk) && exists(sk) && exists(wh) && exists(priceId);

    return (
        <Card className="border-indigo-100 dark:border-indigo-900/50">
            <CardHeader className="pb-3 bg-indigo-50/50 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <CardTitle className="text-lg">Stripe Integration</CardTitle>
                    </div>
                    <Badge variant={allConfigured ? "default" : "outline"} className={allConfigured ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
                        {allConfigured ? "Ready" : "Setup Required"}
                    </Badge>
                </div>
                <CardDescription>
                    Required keys for billing, upgrades, and portal access.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="flex flex-col">
                    <CheckItem label="Public Key" envName="NEXT_PUBLIC_STRIPE_PUBLIC_KEY" val={pk} />
                    <CheckItem label="Secret Key" envName="STRIPE_SECRET_KEY" val={sk} isSecret />
                    <CheckItem label="Webhook Secret" envName="STRIPE_WEBHOOK_SECRET" val={wh} isSecret />
                    <CheckItem label="Price ID (Premium)" envName="PREMIUM_PLAN_PRICE_ID" val={priceId} />
                    <CheckItem label="Portal Return URL" envName="BILLING_PORTAL_RETURN_URL" val={returnUrl} />
                </div>
            </CardContent>
            {!allConfigured && (
                <CardFooter className="bg-muted/50 py-3 text-xs text-muted-foreground flex justify-between">
                    <span>See <code>blueprints/features/billing-stripe.md</code> for setup instructions.</span>
                    <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" className="flex items-center gap-1 hover:text-indigo-600">
                        Get Keys <ExternalLink className="h-3 w-3" />
                    </a>
                </CardFooter>
            )}
        </Card>
    );
}
