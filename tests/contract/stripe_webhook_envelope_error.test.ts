import { describe, it, expect } from 'vitest';
import { POST as webhook } from '../../app/api/webhooks/stripe/route';

// H205 (partial): Envelope error test for webhook route

describe('Stripe Webhook (Envelope Mode Error)', () => {

    it('returns error envelope for invalid signature/body', async () => {
        const req = new Request('http://test/api/webhooks/stripe', { method: 'POST', body: 'invalid-json' });
        // @ts-expect-error minimal
        const res: Response = await webhook(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.ok).toBe(false);
        expect(json.error.code).toBe('WEBHOOK_ERROR');
    });
});
