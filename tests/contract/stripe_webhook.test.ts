import { describe, it, expect } from 'vitest';
import { POST as webhookHandler } from '../../app/api/webhooks/stripe/route';

function makeRequest(event: any) {
    const body = JSON.stringify(event);
    return {
        headers: { get: () => undefined },
        text: async () => body
    } as any;
}

describe('POST /api/subscriptions/webhook (contract)', () => {
    it('processes checkout.session.completed event', async () => {
        const evt = { id: 'evt_1', type: 'checkout.session.completed' };
        const res = await webhookHandler(makeRequest(evt));
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data.type).toBe(evt.type);
    });

    it('processes customer.subscription.updated event', async () => {
        const evt = { id: 'evt_2', type: 'customer.subscription.updated' };
        const res = await webhookHandler(makeRequest(evt));
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data.type).toBe(evt.type);
    });

    it('processes customer.subscription.deleted event idempotently', async () => {
        const evt = { id: 'evt_3', type: 'customer.subscription.deleted' };
        const first = await webhookHandler(makeRequest(evt));
        const firstJson = await first.json();
        expect(firstJson.ok).toBe(true);
        expect(firstJson.data.type).toBe(evt.type);
        expect(firstJson.data.ignored).toBeUndefined();
        const second = await webhookHandler(makeRequest(evt));
        const secondJson = await second.json();
        expect(secondJson.ok).toBe(true);
        expect(secondJson.data.type).toBe(evt.type);
        expect(secondJson.data.ignored).toBe(true); // idempotent second processing
    });
});
