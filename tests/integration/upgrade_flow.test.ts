import { describe, it, expect, beforeEach } from 'vitest';
import { POST as checkoutHandler } from '@/app/api/subscriptions/checkout/route';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { upgradeToPremiumAsync, getSubscriptionAsync, clearAllSubscriptions } from '@/lib/subscriptions/store';
import { makeApiRequest } from '../utils/integration';
import { resetAllState } from '../utils/reset';
import { NextRequest } from 'next/server';
import { clearConfigCache } from '@/lib/config';
import { getPool } from '@/lib/db/simple';

// T021: Upgrade flow integration test
// Scenario: Authenticated free user initiates upgrade -> checkout session created -> (simulate webhook event) -> becomes premium.
// For now we simulate webhook by directly invoking upgradeToPremium (webhook persistence integration will replace this later).

function makeReq(headers: Record<string, string>) {
    // Minimal NextRequest mock for deriveSubscriptionState if needed
    return new NextRequest('http://localhost/api/subscriptions/checkout', { headers });
}

describe('Upgrade flow (integration)', () => {
    const userId = 'user_upgrade_1';

    beforeEach(async () => {
        resetAllState();
        clearAllSubscriptions();
        clearConfigCache();
        // Create user for FK constraint
        await getPool().query("INSERT INTO users (id, email, password_hash) VALUES ($1, 'upgrade_test@example.com', 'hash') ON CONFLICT (id) DO NOTHING", [userId]);
    });

    it('upgrades free user to premium after simulated checkout + webhook', async () => {
        // 1. Start as free (no premium header)
        let state = await deriveSubscriptionStateAsync(makeReq({ 'x-user-id': userId }));
        expect(state.tier).toBe('free');

        // 2. Call checkout endpoint
        const checkoutReq = new NextRequest('http://localhost/api/subscriptions/checkout', { method: 'POST', headers: { 'x-user-id': userId } });
        const checkoutRes = await checkoutHandler(checkoutReq as any);
        expect(checkoutRes.status).toBe(200);
        const checkoutJson = await checkoutRes.json();
        expect(checkoutJson.ok).toBe(true);
        expect(checkoutJson.data.url).toBeDefined();

        // 3. Simulate Stripe webhook (checkout.session.completed + subscription created) by upgrading in store
        await upgradeToPremiumAsync(userId);
        const sub = await getSubscriptionAsync(userId);
        expect(sub).toBeTruthy();
        expect(sub!.tier).toBe('premium');
        expect(sub!.status).toBe('active');

        // 4. Derive subscription state now reflects store tier (premium) when header doesn't override.
        state = await deriveSubscriptionStateAsync(makeReq({ 'x-user-id': userId }));
        expect(state.tier).toBe('premium');

        // 5. When header reflects premium (simulating updated session), tier becomes premium
        const premiumState = await deriveSubscriptionStateAsync(makeReq({ 'x-user-id': userId, 'x-user-premium': 'true' }));
        expect(premiumState.tier).toBe('premium');
    });
});
