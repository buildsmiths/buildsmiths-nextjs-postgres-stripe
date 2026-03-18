import React from 'react';
import { SignInPanel } from '@/components/SignInPanel';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from "@/components/ui/button"

export const metadata = {
    title: 'Sign in',
    description: 'Authenticate to access your dashboard and account.'
};

export default async function AuthPage() {
    const session = await getServerSession(authOptions as any);

    if ((session as any)?.user) {
        return (
            <main aria-label="Auth" className="max-w-md mx-auto p-6 space-y-4" data-auth-state="signed-in">
                <h1 className="text-lg font-semibold">You’re already signed in</h1>
                <p className="text-sm text-muted-foreground">
                    {(session as any).user.email ? (
                        <>Signed in as <span className="font-medium text-foreground">{(session as any).user.email}</span>.</>
                    ) : (
                        <>You’re signed in and don’t need to authenticate again.</>
                    )}
                </p>
                <div>
                    <Button asChild>
                        <a href="/dashboard">Go to dashboard</a>
                    </Button>
                </div>
            </main>
        );
    }

    const enableGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    return (
        <div className="max-w-md mx-auto p-6 space-y-4" data-auth-state="signed-out">
            <h1 className="text-lg font-semibold">Sign in</h1>
            <p className="text-sm text-muted-foreground">Access the dashboard after authenticating.</p>
            <SignInPanel enableGoogle={enableGoogle} />
        </div>
    );
}
