import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const handler = NextAuth(authOptions as any);

async function POST(req: NextRequest, ctx: any) {
        try {
            } catch {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return handler(req, ctx);
}

export { handler as GET, POST };
