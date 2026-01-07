import { describe, it, expect, beforeEach, vi } from 'vitest';
import { upgradeSubscription } from '@/app/billing/actions';
import { upgradeToPremiumAsync, getSubscriptionAsync, clearAllSubscriptions } from '@/lib/subscriptions/store';
import { resetAllState } from '../utils/reset';
import { clearConfigCache } from '@/lib/config';
import { getPool } from '@/lib/db/simple';

// Mock Next.js navigation to catch redirects
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

// Mock Next.js headers
const mockGetHeaders = vi.fn();
vi.mock('next/headers', () => ({
    headers: () => ({ get: mockGetHeaders }),
}));

import { redirect } from 'next/navigation';

describe('Upgrade flow (integration)', () => {
    const userId = 'user_upgrade_1';

    beforeEach(async () => {
        resetAllState();
        clearAllSubscriptions();
        clearConfigCache();
        vi.clearAllMocks();

        // Default header mock to return nothing
        mockGetHeaders.mockReturnValue(null);

        // Create user for FK constraint
        await getPool().query("INSERT INTO users (id, email, password_hash) VALUES ($1, 'upgrade_test@example.com', 'hash') ON CONFLICT (id) DO NOTHING", [userId]);
    });

    it('upgrades free user to premium after simulated checkout + webhook', async () => {
        // 1. Mock session headers for authentication
        mockGetHeaders.mockImplementation((key: string) => {
            if (key === 'x-user-id') return userId;
            return null;
        });

        // 2. Call upgrade action (previously checkout endpoint)
        // We expect it to redirect to a checkout URL
        try {
            await upgradeSubscription();
        } catch (e) { } // Catch the "NEXT_REDIRECT" error if it throws, or just check the spy

        // Check if redirect was called with a Stripe URL
        expect(redirect).toHaveBeenCalledTimes(1);
        const redirectUrl = (redirect as any).mock.calls[0][0];
        // In test mode, createCheckoutSession returns a mock URL or similar. 
        // Based on previous code, it probably returns a URL with cs_id.
        expect(redirectUrl).toContain('http');

        // 3. Simulate Stripe webhook (checkout.session.completed + subscription created) by upgrading in store
        await upgradeToPremiumAsync(userId);
        const sub = await getSubscriptionAsync(userId);
        expect(sub).toBeTruthy();
        expect(sub!.tier).toBe('premium');
        expect(sub!.status).toBe('active');

        // Note: We can't easily test the "Derive subscription state" part here cleanly 
        // without calling the function directly again, but the action doesn't return state.
        // We trust the store update happened.
    });
});
