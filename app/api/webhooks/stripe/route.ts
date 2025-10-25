import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAndParse, handleStripeWebhook } from '@/lib/stripe/webhook';
import { log } from '@/lib/logging/log';
import { ok, err } from '@/lib/errors';

// T039: Stripe webhook route.

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const started = Date.now();
    log.info('route.webhooks.stripe.enter', {});
    try {
        const signature = req.headers.get('stripe-signature') || undefined;
        const rawBody = await req.text();
        const event = verifySignatureAndParse(rawBody, signature);
        const result = await handleStripeWebhook(event as any);
        log.info('route.webhooks.stripe.result', { type: result.type, ignored: result.ignored, ms: Date.now() - started });
        const body = { ok: result.ok, type: result.type, ignored: result.ignored };
        return NextResponse.json(ok(body));
    } catch (error: any) {
        log.error('route.webhooks.stripe.error', { error: error.message || String(error), ms: Date.now() - started });
        return NextResponse.json(err('WEBHOOK_ERROR', 'Webhook processing failed', { detail: error.message || String(error) }), { status: 400 });
    }
}
