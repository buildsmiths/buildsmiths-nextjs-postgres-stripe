import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import NextStepsCard from '@/components/NextStepsCard';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import { isStripeConfigured } from '@/lib/config';
import { upgradeSubscription, manageSubscription } from './actions';

export default async function AccountPage() {
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        // Fallback for build time or environments where headers() might fail
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }

    // Fetch current subscription/auth state
    const state = await deriveSubscriptionStateAsync(reqLike);
    const isDemo = !state.authenticated;
    const stripeConfigured = isStripeConfigured();

    // Define display user - real if auth, mock if demo
    const displayUser = isDemo ? {
        name: "Guest User",
        email: "guest@example.com",
        id: "usr_mock_guest_123",
        initials: "GU"
    } : {
        name: (state.rawSession as any)?.name || "User",
        email: (state.rawSession as any)?.email || "No email",
        id: (state.rawSession as any)?.userId || "Unknown ID",
        initials: ((state.rawSession as any)?.email?.[0] || "U").toUpperCase()
    };

    // Extract plan details
    const currentTier = (state.tier || 'free') as string;
    const isPremium = currentTier === 'premium';

    // Format date if available
    let periodEnd = "N/A";
    const anyState = state as any;
    const rawPeriod = anyState?.subscription?.currentPeriodEnd || anyState?.currentPeriodEnd;
    if (rawPeriod) {
        try {
            const d = (rawPeriod instanceof Date) ? rawPeriod : new Date(rawPeriod);
            if (!Number.isNaN(d.getTime())) {
                periodEnd = d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            }
        } catch (e) { }
    }

    return (
        <main aria-label="Account" className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your profile, billing, and notification preferences.
                    </p>
                </div>
                {isDemo && (
                    <Button variant="outline" asChild>
                        <a href="/api/auth/signin">Sign In</a>
                    </Button>
                )}
                {!isDemo && (
                    <Button variant="outline" className="text-muted-foreground" disabled>
                        Signed in as {displayUser.email}
                    </Button>
                )}
            </div>

            {/* Demo Banner */}
            {isDemo && (
                <Alert className="bg-muted/50 border-muted-foreground/20">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Public Demo Mode</AlertTitle>
                    <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
                        <span>You are viewing this page as a visitor. The data below is mocked for demonstration purposes.</span>
                        <Button variant="link" className="h-auto p-0 text-primary" asChild>
                            <a href="/quickstart">Get the Code</a>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">

                {/* Left Column */}
                <div className="space-y-6">

                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${displayUser.email}&backgroundColor=e5e7eb`}
                                        alt={displayUser.name}
                                    />
                                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                        {displayUser.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="font-medium leading-none">{displayUser.name}</h3>
                                    <p className="text-sm text-muted-foreground">{displayUser.email}</p>
                                    <Badge variant="outline" className="font-mono text-[10px] mt-1 text-muted-foreground">
                                        {displayUser.id}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" value={displayUser.email} disabled className="bg-muted/50" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 bg-muted/50 flex justify-between">
                            <span className="text-xs text-muted-foreground italic">Managed via Authentication Provider</span>
                        </CardFooter>
                    </Card>

                    {/* Subscription/Plan Card */}
                    <Card className={isPremium ? "border-primary/20 bg-primary/5" : ""}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Subscription</span>
                                <Badge variant={isPremium ? "default" : "secondary"} className="uppercase">
                                    {currentTier}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Manage your plan and billing details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!stripeConfigured && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Stripe Not Configured</AlertTitle>
                                    <AlertDescription className="text-xs mt-1">
                                        Add Stripe keys to .env.local to enable billing features.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Current Plan</span>
                                <span className="font-medium capitalize">{currentTier} Tier</span>
                            </div>
                            {isPremium && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Renews on</span>
                                    <span className="font-medium">{periodEnd}</span>
                                </div>
                            )}
                            <div className="rounded-lg border p-3 bg-background text-sm text-muted-foreground">
                                {isPremium
                                    ? "You have full access to all premium features."
                                    : "Upgrade to unlock premium api endpoints and priority support."
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            {!stripeConfigured ? (
                                <Button className="w-full" disabled>Billing Disabled</Button>
                            ) : isDemo ? (
                                <Button className="w-full" asChild variant="outline">
                                    <a href="/api/auth/signin">Sign in to Upgrade</a>
                                </Button>
                            ) : isPremium ? (
                                <form action={manageSubscription} className="w-full">
                                    <Button variant="outline" className="w-full" type="submit">
                                        Manage Billing
                                    </Button>
                                </form>
                            ) : (
                                <form action={upgradeSubscription} className="w-full">
                                    <Button className="w-full" type="submit">
                                        Upgrade to Premium
                                    </Button>
                                </form>
                            )}
                        </CardFooter>
                    </Card>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Preferences Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Manage your app notifications and settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
                                </div>
                                <Switch disabled={isDemo} checked={false} aria-label="Marketing emails" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Security Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified about suspicious activity.</p>
                                </div>
                                <Switch disabled={isDemo} checked={true} aria-label="Security alerts" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public Profile</Label>
                                    <p className="text-sm text-muted-foreground">Make your profile visible to other users.</p>
                                </div>
                                <Switch disabled={isDemo} checked={true} aria-label="Public profile" />
                            </div>
                        </CardContent>
                        {isDemo && (
                            <CardFooter className="bg-muted/50 px-6 py-3 border-t">
                                <p className="text-xs text-muted-foreground">Settings are disabled in demo mode.</p>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Developer/API Card (Only for devs) */}
                    <Card>
                        <div className="p-6 pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Developer Access
                            </h3>
                        </div>
                        <NextStepsCard
                            items={[
                                <span>Access the <a className="text-primary hover:underline font-medium" href="/api/feature/premium-example">Premium API Endpoint</a> used for testing tiered access.</span>,
                                <span>Detailed service health is available at <a className="text-primary hover:underline font-medium" href="/api/health">/api/health</a>.</span>,
                                <span>Check your session claims in <a className="text-primary hover:underline font-medium" href="/api/auth/session">/api/auth/session</a>.</span>,
                            ]}
                        />
                    </Card>

                </div>
            </div>
        </main>
    );
}
