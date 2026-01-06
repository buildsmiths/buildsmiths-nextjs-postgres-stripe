import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type NextStepsCardProps = {
    title?: string;
    items: React.ReactNode[];
    ariaLabel?: string;
    className?: string;
};

export default function NextStepsCard({ title = 'Next steps', items, ariaLabel = 'Getting started', className }: NextStepsCardProps) {
    return (
        <Card aria-label={ariaLabel} className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-1 marker:text-muted-foreground text-sm">
                    {items.map((node, i) => (
                        <li key={i}>{node}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
