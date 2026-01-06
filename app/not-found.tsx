import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Page not found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">The page you’re looking for doesn’t exist or was moved.</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild variant="link">
                        <Link href="/">Back to home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
