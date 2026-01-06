import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"

// Dashboard route-level loading UI (Next.js app router convention)
// Lightweight and accessible; avoids layout shift by reserving space.
export default function Loading() {
    return (
        <div role="status" aria-busy="true" aria-label="Loading dashboard" className="max-w-5xl mx-auto px-4 py-10 space-y-6">
            {/* Visible, friendly copy to reduce perceived wait */}
            <div className="max-w-lg space-y-2">
                <h2 className="text-base font-semibold">Loading dashboard…</h2>
                <p className="text-sm text-muted-foreground">Preparing your data and session.</p>
            </div>
            <span className="sr-only">Loading dashboard...</span>
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        </div>
    );
}
