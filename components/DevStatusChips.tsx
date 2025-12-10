import React from 'react';
import { isStripeConfigured } from '@/lib/config';
import { query } from '@/lib/db/simple';

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
        const t0 = Date.now();
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (!res.ok) return null;
        await res.json();
        return Date.now() - t0;
    } catch {
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
        <span className={`px-2 py-0.5 rounded ${ok ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : warn ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>{text}</span>
    );

    return (
        <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded ${env === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>{env}</span>
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
