'use server';

import { hash } from 'bcryptjs';
import { query } from '@/lib/db/simple';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500,
});

export async function registerAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1';

    try {
        await limiter.check(5, ip); // 5 requests per minute
    } catch {
        return { ok: false, code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' };
    }

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return { ok: false, code: 'BAD_REQUEST', message: 'Invalid email or password.' };
    }

    if (password.length < 8) {
        return { ok: false, code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' };
    }

    const pw = await hash(password, 12);

    try {
        await query('insert into users(email, password_hash) values ($1, $2)', [email, pw]);
    } catch (e: any) {
        if (/unique|duplicate/i.test(e?.message || '')) {
            return { ok: false, code: 'EMAIL_IN_USE', message: 'This email is already registered.' };
        }
        console.error('Registration error:', e);
        return { ok: false, code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' };
    }

    // Success! 
    // We cannot automatically sign them in comfortably with NextAuth v4 Credential provider from the server side 
    // without some tricks. So we will return success and let the client handle the signIn call (or redirect to logic).
    // But since the UI expects to sign in immediately after register, we return success.
    return { ok: true, code: 'SUCCESS', message: 'Account created.' };
}
