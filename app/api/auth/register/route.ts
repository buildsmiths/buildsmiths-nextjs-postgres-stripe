import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { query } from '../../../../lib/db/simple';

export async function POST(req: NextRequest) {
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
