'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SystemActivityChart() {
    // Mock data representing recent system events for the dev dashboard
    // In a real app, this would come from `await db.select().from(audit_events)...`
    const data = [
        { time: '09:00', events: 12, api_calls: 45 },
        { time: '10:00', events: 18, api_calls: 50 },
        { time: '11:00', events: 35, api_calls: 80 }, // spike
        { time: '12:00', events: 25, api_calls: 65 },
        { time: '13:00', events: 20, api_calls: 40 },
        { time: '14:00', events: 45, api_calls: 95 },
        { time: '15:00', events: 30, api_calls: 70 },
    ];

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>Simulated stream of API calls and Audit events during local dev.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area type="monotone" dataKey="api_calls" stroke="#8884d8" fillOpacity={1} fill="url(#colorApi)" name="API Calls" />
                        <Area type="monotone" dataKey="events" stroke="#82ca9d" fillOpacity={1} fill="url(#colorEvents)" name="Audit Events" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ResourceUsageChart() {
    // Mock metric data
    const data = [
        { name: 'DB Conn', used: 4, total: 20 },
        { name: 'Cache', used: 12, total: 100 },
        { name: 'Storage', used: 45, total: 100 },
    ];

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Resource Simulation</CardTitle>
                <CardDescription>Mocked provisioning stats.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="used" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32} />
                        <Bar dataKey="total" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
