import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { query } from '@/lib/db/simple';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge"

interface AuditEvent {
    id: string;
    ts: Date;
    actor: string | null;
    type: string;
    payload: any;
}

export async function RecentActivity() {
    let events: AuditEvent[] = [];
    try {
        const res = await query<AuditEvent>(`
            select id, ts, actor, type, payload 
            from audit_events 
            order by ts desc 
            limit 5
        `);
        events = res.rows;
    } catch (e) {
        console.error("Failed to fetch audit events", e);
    }

    // Fallback to mock data if no events found (for demo purposes)
    if (events.length === 0) {
        events = [
            { id: 'mock-1', ts: new Date(), actor: 'user_demo', type: 'auth.signin', payload: { method: 'credentials', ip: '192.168.1.1' } },
            { id: 'mock-2', ts: new Date(Date.now() - 1000 * 60 * 15), actor: 'system', type: 'worker.job_completed', payload: { job: 'cleanup_sessions', duration: '120ms' } },
            { id: 'mock-3', ts: new Date(Date.now() - 1000 * 60 * 45), actor: 'user_test', type: 'subscription.created', payload: { plan: 'premium', status: 'active' } },
            { id: 'mock-4', ts: new Date(Date.now() - 1000 * 60 * 60 * 2), actor: 'stripe_webhook', type: 'invoice.paid', payload: { amount: 2900, currency: 'usd' } },
            { id: 'mock-5', ts: new Date(Date.now() - 1000 * 60 * 60 * 5), actor: 'system', type: 'db.migration', payload: { version: '20240101_init' } },
        ];
    }

    if (events.length === 0) {
        return (
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Real-time audit logs from your database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-sm">No events found in <code>public.audit_events</code>.</p>
                        <p className="text-xs">Try signing in to generate an event.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Real-time audit logs. <span className="text-xs text-muted-foreground">(Showing mock data if DB empty)</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((evt) => (
                            <TableRow key={evt.id}>
                                <TableCell className="text-xs text-muted-foreground font-mono">
                                    {new Date(evt.ts).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal text-xs">{evt.type}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {evt.actor || <span className="text-muted-foreground italic">system</span>}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground max-w-[200px] truncate font-mono">
                                    {JSON.stringify(evt.payload)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
