import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logging/log';

// Minimal auth callback endpoint: redirects to dashboard.
export async function GET(req: NextRequest) {
    log.info('route.auth.callback.enter');
    // Prefer the incoming request origin to construct redirect URL (Codespaces/proxy safe).
    // In tests, req.url may be undefined or invalid; fall back to NEXT_PUBLIC_SITE_URL or localhost.
    const base = (() => {
        try {
            if (req?.url) {
                const u = new URL(req.url);
                return u.origin;
            }
        } catch {
            // Ignore invalid or missing req.url; fall back to configured site URL
        }
        return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    })();
    const dest = new URL('/dashboard', base);
    return NextResponse.redirect(dest);
}
