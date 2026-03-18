import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { SystemActivityChart, ResourceUsageChart } from '@/components/admin/DashboardCharts';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { headers } from 'next/headers';
import React from 'react';
import PostCallbackStatus from '@/components/PostCallbackStatus';
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const hdrs = await headers();
    const reqLike = { headers: hdrs } as any;
    const state = await deriveSubscriptionStateAsync(reqLike);

    return (
        <main aria-label="Admin Dashboard" className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight" aria-current="page">Admin Dashboard</h1>
                        <Badge variant="outline" className="ml-2">Dashboard</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        System status, recent activity, and developer tasks.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Logged in as</p>
                        <p className="text-sm font-medium">{state.rawSession?.email || 'User'}</p>
                    </div>
                </div>
            </header>

            <PostCallbackStatus />

            <section className="">
                <SystemActivityChart />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentActivity />
                <ResourceUsageChart />
            </section>

        </main>
    );
}
