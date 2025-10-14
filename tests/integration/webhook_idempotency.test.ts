import { describe, it, expect, beforeEach } from 'vitest';
import { POST as webhookHandler } from '../../app/api/webhooks/stripe/route';
import { resetAllState } from '../utils/reset';
import { makeJsonRequest } from '../utils/integration';

// T024: Webhook idempotency integration test
// Scenario: Same webhook event delivered twice -> second processing is ignored / idempotent with no duplicate side-effects.

describe('Webhook idempotency (integration)', () => {
    beforeEach(() => {
        resetAllState();
    });

    it('ignores duplicate webhook event (second ignored=true)', async () => {
        const evt = { id: 'evt_idem_1', type: 'customer.subscription.updated' };
        const first = await webhookHandler(makeJsonRequest(evt));
        expect(first.status).toBe(200);
        const firstJson = await first.json();
        expect(firstJson.ok).toBe(true);
        expect(firstJson.data.ignored).toBeUndefined();
        expect(firstJson.data.type).toBe(evt.type);

        const second = await webhookHandler(makeJsonRequest(evt));
        expect(second.status).toBe(200);
        const secondJson = await second.json();
        expect(secondJson.ok).toBe(true);
        expect(secondJson.data.type).toBe(evt.type);
        expect(secondJson.data.ignored).toBe(true);
    });

    it('treats different event ids independently', async () => {
        const evt1 = { id: 'evt_diff_1', type: 'checkout.session.completed' };
        const evt2 = { id: 'evt_diff_2', type: 'checkout.session.completed' };
        const r1 = await webhookHandler(makeJsonRequest(evt1));
        const r2 = await webhookHandler(makeJsonRequest(evt2));
        const j1 = await r1.json();
        const j2 = await r2.json();
        expect(j1.ok).toBe(true);
        expect(j2.ok).toBe(true);
        expect(j1.data.ignored).toBeUndefined();
        expect(j2.data.ignored).toBeUndefined();
        expect(j1.data.type).toBe(evt1.type);
        expect(j2.data.type).toBe(evt2.type);
    });
});
