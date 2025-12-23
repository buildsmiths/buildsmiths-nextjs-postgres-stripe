import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { query } from '@/lib/db/simple';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500,
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    try {
        await limiter.check(5, ip); // 5 requests per minute
    } catch {
        return NextResponse.json({ ok: false, code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const { email, password } = await req.json().catch(() => ({ email: undefined, password: undefined }));
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ ok: false, code: 'BAD_REQUEST' }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ ok: false, code: 'WEAK_PASSWORD' }, { status: 400 });
    }
    const pw = await hash(password, 12);
    try {
        await query('insert into users(email, password_hash) values ($1, $2)', [email, pw]);
    } catch (e: any) {
        if (/unique|duplicate/i.test(e?.message || '')) {
            return NextResponse.json({ ok: false, code: 'EMAIL_IN_USE' }, { status: 409 });
        }
        throw e;
    }
    return NextResponse.json({ ok: true });
}
