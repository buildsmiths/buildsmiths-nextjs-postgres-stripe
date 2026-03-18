import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { upgradeSubscription, manageSubscription } from './actions';

export const metadata = {
    title: 'Account Settings',
    description: 'Manage your account, profile, and subscription settings.'
};

export default async function AccountPage() {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user) {
        redirect('/auth');
    }
    const user = { id: (session as any)?.user?.id, email: (session as any)?.user?.email || '' };
    const subscription = null;

    return (
        <main aria-label="Account Settings" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                    <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Label htmlFor="picture">Profile Picture</Label>
                                    <Input id="picture" type="file" className="mt-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue={user.email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Customize your application experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive weekly digest emails.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive offers and promotions.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>Manage your billing and plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Current Plan</p>
                                    <p className="text-sm text-muted-foreground uppercase">Free Tier</p>
                                </div>
                                <Badge variant={false ? 'default' : 'secondary'}>
                                    {false ? 'Active' : 'Free Tier'}
                                </Badge>
                            </div>
  
                            <div className="mt-4 p-4 border rounded-lg bg-muted/50 border-dashed">
                                <p className="text-sm text-muted-foreground">
                                    Premium features are locked. To utilize premium logic, follow <code className="font-mono bg-muted px-1 rounded">blueprints/billing-stripe.md</code> to integrate Stripe.
                                </p>
                            </div>
                                
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {true ? (
                                <form action={upgradeSubscription}>
                                    <Button type="submit">Upgrade to Premium</Button>
                                </form>
                            ) : (
                                <form action={manageSubscription}>
                                    <Button type="submit" variant="outline">Manage Billing</Button>
                                </form>
                            )}
                        </CardFooter>
                    </Card>

                    <Card border-destructive>
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>Irreversible account actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Deleting your account will permanently remove all your data. This action cannot be undone.
                            </p>
                            <Button variant="destructive">Delete Account</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
