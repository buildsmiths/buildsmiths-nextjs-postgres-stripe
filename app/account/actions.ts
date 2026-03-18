'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getEffectiveTier } from '@/lib/access/policy';
import { recordAudit } from '@/lib/logging/audit';
import { log } from '@/lib/logging/log';
import { deriveSubscriptionStateAsync } from '@/lib/access/subscriptionState';

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

    log.info('action.upgradeSubscription.not_implemented', { userId: session.userId });
    throw new Error('Billing is not implemented. Refer to blueprints/billing-stripe.md to add Stripe integration.');
}

export async function manageSubscription() {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect('/auth');
    }

    log.info('action.manageSubscription.not_implemented', { userId: session.userId });
    throw new Error('Billing is not implemented. Refer to blueprints/billing-stripe.md to add Stripe integration.');
}
