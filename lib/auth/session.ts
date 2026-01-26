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
        log.debug('auth_session.enter');
        // In dev, help NextAuth find its URL to avoid warnings when NEXTAUTH_URL isn't set.
        if (!process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')) {
            try {
                // Use origin only; NextAuth derives path itself
                const u = new URL(process.env.NEXT_PUBLIC_SITE_URL);
                (process.env as any).NEXTAUTH_URL = `${u.origin}`;
            } catch {
                // ignore
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
