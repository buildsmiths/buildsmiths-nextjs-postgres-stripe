import React from 'react';
import { isStripeConfigured } from '@/lib/config';
import { query } from '@/lib/db/simple';
import { Badge } from "@/components/ui/badge"

async function schemaPresent(): Promise<boolean> {
    try {
        const { rows } = await query<{ t: string | null }>(`select to_regclass('public.users') as t`);
        return Boolean(rows[0]?.t);
    } catch {
        return false;
    }
}

async function healthMs(): Promise<number | null> {
    try {
        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        if (!baseUrl || !baseUrl.startsWith('http')) {
            baseUrl = 'http://localhost:3000';
        }

        // Ensure absolute URL for server-side fetch
        const url = new URL('/api/health', baseUrl).toString();
        // console.log('[DevStatusChips] fetching', url); 
        const t0 = Date.now();
        // Set a short timeout to avoid hanging
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        try {
            const res = await fetch(url, {
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!res.ok) return null;
            await res.json();
            return Date.now() - t0;
        } catch (e) {
            clearTimeout(timeout);
            throw e;
        }
    } catch (err: any) {
        // Silent fail to avoid crashing the dashboard if health check fails
        return null;
    }
}

export default async function DevStatusChips() {
    const hasDbUrl = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
    const hasAuthSecret = !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim());
    const hasSiteUrl = !!(process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim());
    const stripeOk = isStripeConfigured();
    const googleOk = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const webhookOk = !!(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET.trim());
    const env = process.env.NODE_ENV || 'development';

    const [hasSchema, ms] = await Promise.all([schemaPresent(), healthMs()]);

    const chip = (ok: boolean, text: string, warn?: boolean) => (
        <Badge variant={ok ? "default" : warn ? "secondary" : "destructive"} className="font-mono font-normal">
            {text}
        </Badge>
    );

    return (
        <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="font-mono font-normal">{env}</Badge>
            {chip(hasDbUrl, hasDbUrl ? 'DB URL set' : 'DB URL missing')}
            {chip(hasSchema, hasSchema ? 'Schema present' : 'Schema missing')}
            {chip(stripeOk, stripeOk ? 'Stripe configured' : 'Stripe placeholder', !stripeOk)}
            {chip(googleOk, googleOk ? 'Google Auth configured' : 'Google Auth optional', !googleOk)}
            {chip(webhookOk, webhookOk ? 'Webhook secured' : 'Webhook missing')}
            {chip(hasAuthSecret, hasAuthSecret ? 'Auth secret set' : 'Auth secret missing')}
            {chip(hasSiteUrl, hasSiteUrl ? 'Site URL set' : 'Site URL missing')}
            {chip(ms != null, ms != null ? `Health ${ms}ms` : 'Health down')}
        </div>
    );
}
