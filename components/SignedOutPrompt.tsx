import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SignedOutPrompt({ ariaLabel = 'Page' }: { ariaLabel?: string }) {
    return (
        <main aria-label={ariaLabel} className="flex items-center justify-center min-h-[50vh] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-xl">Please sign in</CardTitle>
                    <CardDescription>Access the dashboard after authenticating.</CardDescription>
                </CardHeader>
            </Card>
        </main>
    );
}
