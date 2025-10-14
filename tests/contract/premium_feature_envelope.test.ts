import { describe, it, expect } from 'vitest';
import { GET as premiumFeature } from '../../app/api/feature/premium-example/route';

// C104: Ensure envelope mode returns standardized error + success for premium feature route.

describe('Premium Feature (Envelope Mode)', () => {
    it('returns error envelope for non-premium user', async () => {
        const req = new Request('http://test/api/feature/premium-example', { headers: { 'x-user-id': 'free-1' } });
        // @ts-expect-error minimal request shape acceptable for handler
        const res: Response = await premiumFeature(req);
        expect(res.status).toBe(403);
        const json = await res.json();
        expect(json.ok).toBe(false);
        expect(json.error).toMatchObject({ code: 'UPGRADE_REQUIRED' });
        expect(json.meta?.reason).toBeDefined();
    });

    it('returns success envelope for premium user', async () => {
        const req = new Request('http://test/api/feature/premium-example', { headers: { 'x-user-id': 'prem-1', 'x-user-premium': 'true' } });
        // @ts-expect-error minimal request shape acceptable for handler
        const res: Response = await premiumFeature(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data).toMatchObject({ feature: 'premium-example' });
    });
});
