/**
 * Server Auth Session Helper (NextAuth-based)
 * - Dev bearer: Authorization: Bearer test:<userId> in non-prod (unless ALLOW_DEV_BEARER_SHORTCUT=0)
 * - Otherwise uses getServerSession from Auth.js
 */
import { getServerSession } from 'next-auth';
import { authOptions } from './nextauth-options';
import { log } from '../logging/log';

export interface AuthSession {
    userId: string;
    email?: string;
    role?: string;
}

type RequestLike = { headers: { get: (name: string) => string | null } };

export async function getServerAuthSession(req: RequestLike): Promise<AuthSession | null> {
    try {
        log.debug('auth_session.enter', {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
            VERCEL_URL: process.env.VERCEL_URL,
            DATABASE_URL: process.env.DATABASE_URL ? '[REDACTED]' : 'MISSING',
            NODE_ENV: process.env.NODE_ENV,
        });

        // Ensure NEXTAUTH_URL is set so Auth.js doesn't fail server-side
        if (!process.env.NEXTAUTH_URL) {
            // Respect configured site URL first
            const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
            // Only use if it looks like a valid URL (starts with http). 
            // Prevents "base" or other placeholder internal container names from breaking Vercel.
            if (configuredUrl && configuredUrl.startsWith('http')) {
                process.env.NEXTAUTH_URL = configuredUrl;
            } else if (typeof window !== 'undefined') {
                // Should not happen on server, but for completeness
                process.env.NEXTAUTH_URL = window.location.origin;
            } else {
                // Fallback for Vercel preview deployments if not explicitly set
                if (process.env.VERCEL_URL) {
                    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
                }
            }
        }
        const allowDevShortcut = (process.env.NODE_ENV !== 'production') && (process.env.ALLOW_DEV_BEARER_SHORTCUT !== '0');

        const authz = req.headers.get('authorization') || req.headers.get('Authorization');
        if (authz) {
            const m = authz.match(/^Bearer\s+(.+)$/i);
            const token = m?.[1];
            if (token) {
                const testMatch = token.match(/^test:(.+)$/);
                if (testMatch) {
                    if (allowDevShortcut) {
                        const userId = testMatch[1];
                        const role = userId === 'admin' ? 'admin' : undefined;
                        log.debug('auth_session.dev_bearer', { userId, role: role ?? null });
                        return { userId, ...(role ? { role } : {}) } as AuthSession;
                    } else {
                        log.warn('dev_bearer_present_but_disabled', { reason: process.env.NODE_ENV === 'production' ? 'production' : 'env_disabled' });
                        return null;
                    }
                }
            }
        }

        const session: any = await getServerSession(authOptions as any);
        const user: any = session?.user as any;
        const id: string | undefined = user?.id as string | undefined;
        if (id) {
            const out: AuthSession = { userId: id };
            if (user?.email) (out as any).email = user.email as string;
            return out;
        }
        return null;
    } catch {
        return null;
    }
}
