'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getEffectiveTier } from '@/lib/access/policy';
import { createCheckoutSession } from '@/lib/stripe/checkout';
import { createPortalSession } from '@/lib/stripe/portal';
import { recordAudit } from '@/lib/logging/audit';
import { log } from '@/lib/logging/log';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';
import { isStripeConfigured } from '@/lib/config';

async function getSession() {
    const hdrs = await headers();
    const reqLike = { headers: hdrs } as any;
    const state = await deriveSubscriptionStateAsync(reqLike);
    return state.rawSession;
}

export async function upgradeSubscription() {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect('/auth');
    }

    if (!isStripeConfigured()) {
        // In a real app we might show a toast, but for this template check
        // we'll just throw or return an error state. 
        // Since this is a form action, raising an error is visible if handled, 
        // but lets just redirect to account with an error param or similar.
        // For simplicity:
        throw new Error('Stripe is not configured');
    }

    const tier = getEffectiveTier(session);
    if (tier === 'premium') {
        // Already premium
        redirect('/account');
    }

    const checkout = await createCheckoutSession(session.userId);
    recordAudit('subscription.checkout.requested', { actor: session.userId, checkoutId: checkout.id });
    log.info('action.upgradeSubscription.success', { userId: session.userId, checkoutId: checkout.id });

    if (checkout.url) {
        redirect(checkout.url);
    }
}

export async function manageSubscription() {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect('/auth');
    }

    if (!isStripeConfigured()) {
        throw new Error('Stripe is not configured');
    }

    const tier = getEffectiveTier(session);
    if (tier !== 'premium') {
        // Not premium, can't manage
        redirect('/account');
    }

    const portal = await createPortalSession(session.userId);
    recordAudit('subscription.portal.requested', { actor: session.userId, portalId: portal.id });
    log.info('action.manageSubscription.success', { userId: session.userId, portalId: portal.id });

    if (portal.url) {
        redirect(portal.url);
    }
}
