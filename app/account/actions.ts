'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getSession() {
    return await getServerSession(authOptions as any);
}

export async function upgradeSubscription() {
    const session = await getSession();
    if (!session || !((session as any).user as any)?.id) {
        redirect('/auth');
    }

    console.info('action.upgradeSubscription.not_implemented', { userId: ((session as any).user as any)?.id });
    throw new Error('Billing is not implemented. Refer to blueprints/billing-stripe.md to add Stripe integration.');
}

export async function manageSubscription() {
    const session = await getSession();
    if (!session || !((session as any).user as any)?.id) {
        redirect('/auth');
    }

    console.info('action.manageSubscription.not_implemented', { userId: ((session as any).user as any)?.id });
    throw new Error('Billing is not implemented. Refer to blueprints/billing-stripe.md to add Stripe integration.');
}
