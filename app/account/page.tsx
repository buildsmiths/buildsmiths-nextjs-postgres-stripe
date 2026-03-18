import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { upgradeSubscription, manageSubscription } from './actions';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata = {
    title: 'Account Settings',
    description: 'Manage your account and subscription tier'
};

export default async function AccountPage() {
    const hdrs = await headers();
    const reqLike = { headers: hdrs } as any;
    const state = await deriveSubscriptionStateAsync(reqLike);

    const email = state.rawSession?.email || "User";

    return (
        <main aria-label="Account Settings" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your profile, preferences, and subscription tier.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} alt="Avatar" />
                        <AvatarFallback>{email.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                Personal information associated with your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={email} readOnly disabled />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>
                                Manage your communication and display preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive news and updates.</p>
                                </div>
                                <Switch disabled={true} checked={false} aria-label="Marketing emails" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Security Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Receive critical security notifications.</p>
                                </div>
                                <Switch disabled={true} checked={true} aria-label="Security alerts" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public Profile</Label>
                                    <p className="text-sm text-muted-foreground">Allow others to see your profile.</p>
                                </div>
                                <Switch disabled={true} checked={true} aria-label="Public profile" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscription Tier */}
                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>
                                Your current plan and features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Current Plan:</span>
                                <Badge variant={state.tier === 'premium' ? "default" : "secondary"} className="capitalize">
                                    {state.tier === 'premium' ? 'Pro Plan' : 'Free Plan'}
                                </Badge>
                            </div>
                            {state.tier === 'premium' ? (
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">✓ Priority Support</li>
                                    <li className="flex items-center gap-2">✓ Unlimited Projects</li>
                                    <li className="flex items-center gap-2">✓ Advanced Analytics</li>
                                    <li className="flex items-center gap-2">✓ Custom Domains</li>
                                </ul>
                            ) : (
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">✓ Basic Support</li>
                                    <li className="flex items-center gap-2">✓ 1 Project</li>
                                    <li className="flex items-center gap-2">✓ Standard Analytics</li>
                                    <li className="flex items-center gap-2 opacity-50">✕ Custom Domains</li>
                                </ul>
                            )}
                        </CardContent>
                        <CardFooter className="pt-6">
                            {state.tier === 'premium' ? (
                                <form action={manageSubscription} className="w-full">
                                    <Button className="w-full" asChild variant="outline">
                                        <button type="submit">Manage Subscription</button>
                                    </Button>
                                </form>
                            ) : (
                                <form action={upgradeSubscription} className="w-full">
                                    <Button className="w-full" asChild variant="default">
                                        <button type="submit">Upgrade to Pro</button>
                                    </Button>
                                </form>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    );
}
