"use client";
import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Something went wrong</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">An unexpected error occurred. Please try again.</p>
                    {process.env.NODE_ENV !== 'production' && (
                        <pre className="text-xs text-left whitespace-pre-wrap bg-muted border rounded p-3 overflow-auto max-h-48 font-mono">{String(error?.message || '')}</pre>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => reset()}>Try again</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
