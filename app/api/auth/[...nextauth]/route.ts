import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-options';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const handler = NextAuth(authOptions as any);

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500,
});

async function POST(req: NextRequest, ctx: any) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    try {
        await limiter.check(10, ip); // 10 requests per minute for auth ops
    } catch {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return handler(req, ctx);
}

export { handler as GET, POST };
