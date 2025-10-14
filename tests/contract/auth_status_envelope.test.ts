import { describe, it, expect } from 'vitest';
import { GET as authStatus } from '../../app/api/auth/status/route';

// Contract test (envelope mode) for auth status endpoint.
// Envelope is always-on; no flag toggling required.

describe('Auth Status (Envelope Mode)', () => {
    it('returns envelope for unauthenticated user', async () => {
        const req = new Request('http://test/api/auth/status');
        // @ts-expect-error - mimic NextRequest minimal shape
        const res: Response = await authStatus(req);
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data).toMatchObject({ authenticated: false, tier: 'visitor' });
    });

    it('returns envelope for authenticated premium user', async () => {
        const req = new Request('http://test/api/auth/status', { headers: { 'x-user-id': 'user123', 'x-user-premium': 'true' } });
        // @ts-expect-error - minimal request for Next handler
        const res: Response = await authStatus(req);
        const json = await res.json();
        expect(json.ok).toBe(true);
        expect(json.data.authenticated).toBe(true);
        expect(json.data.tier).toBe('premium');
        expect(json.data.user.id).toBe('user123');
    });
});
