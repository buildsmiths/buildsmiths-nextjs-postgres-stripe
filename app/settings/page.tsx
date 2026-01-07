import React from 'react';
import { headers } from 'next/headers';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function SettingsPage() {
    let reqLike: any;
    try {
        const hdrs = await headers();
        reqLike = { headers: hdrs } as any;
    } catch {
        reqLike = { headers: { get: (_key: string) => null } } as any;
    }
    const state = await deriveSubscriptionStateAsync(reqLike);

    return (
        <main aria-label="Settings" className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            {!state.authenticated && (
                <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 text-sm flex items-center justify-between">
                    <p>👀 <strong>Public Demo Mode</strong>: You are viewing this page as a Visitor.</p>
                    <Button variant="secondary" size="sm" asChild>
                        <a href="/quickstart">Get the Code</a>
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your preferences and application settings.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Display Name</CardTitle>
                    <CardDescription>
                        This is your public display name. It can be your real name or a pseudonym.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input
                                id="display-name"
                                placeholder="Enter your name"
                                disabled={!state.authenticated}
                                defaultValue={state.authenticated ? "Demo User" : ""}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button disabled>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Configure how you receive alerts and updates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="marketing" className="flex flex-col space-y-1">
                            <span>Marketing emails</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive emails about new products, features, and more.
                            </span>
                        </Label>
                        <Input id="marketing" type="checkbox" className="h-4 w-4" disabled />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="security" className="flex flex-col space-y-1">
                            <span>Security emails</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive emails about your account security.
                            </span>
                        </Label>
                        <Input id="security" type="checkbox" className="h-4 w-4" checked readOnly />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
