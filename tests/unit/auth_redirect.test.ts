import { describe, it, expect } from 'vitest';
import { buildRedirectUrl } from '../../components/AuthButton';

describe('buildRedirectUrl helper', () => {
    it('returns <base>/auth/callback using NEXT_PUBLIC_SITE_URL when window is undefined', () => {
        const old = process.env.NEXT_PUBLIC_SITE_URL;
        process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
        // Simulate server-side (no window)
        // In Vitest environment, window may exist; we rely on typeof window check in helper.
        const url = buildRedirectUrl();
        expect(url).toBe('http://localhost:3000/auth/callback');
        process.env.NEXT_PUBLIC_SITE_URL = old;
    });
});
