import { describe, it, expect } from 'vitest';
import { POST as checkout } from '@/app/api/subscriptions/checkout/route';

// H205 (partial): Envelope tests for checkout route

describe('Subscriptions Checkout (Envelope Mode)', () => {

    it('denies unauthenticated user with envelope error', async () => {
        const req = new Request('http://test/api/subscriptions/checkout', { method: 'POST' });
        // @ts-expect-error minimal
        const res: Response = await checkout(req);
        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json.ok).toBe(false);
        expect(json.error.code).toBe('UNAUTHORIZED');
    });

    it('denies already premium user', async () => {
        const req = new Request('http://test/api/subscriptions/checkout', { method: 'POST', headers: { 'x-user-id': 'p1', 'x-user-premium': 'true' } });
        // @ts-expect-error minimal
        const res: Response = await checkout(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.ok).toBe(false);
        expect(json.error.code).toBe('ALREADY_PREMIUM');
    });

    it('returns checkout session for free user', async () => {
        const req = new Request('http://test/api/subscriptions/checkout', { method: 'POST', headers: { 'x-user-id': 'u-free' } });
        // @ts-expect-error minimal
        const res: Response = await checkout(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data.id).toMatch(/^cs_/);
    });
});
