import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { query } from '../db/simple';

export const authOptions = {
    session: { strategy: 'jwt' as const },
    pages: {
        signIn: '/auth',
        error: '/auth'
    },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(creds: Record<string, unknown> | undefined) {
                const email = creds?.email as string | undefined;
                const password = creds?.password as string | undefined;
                if (!email || !password) return null;
                const { rows } = await query<{ id: string; email: string; password_hash: string }>(
                    'select id, email, password_hash from users where lower(email)=lower($1) limit 1',
                    [email]
                );
                const user = rows[0];
                if (!user) return null;
                const ok = await compare(password, user.password_hash);
                return ok ? { id: user.id, email: user.email } : null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user?.id) token.sub = user.id;
            return token;
        },
        async session({ session, token }: any) {
            if (token?.sub) (session.user as any).id = token.sub;
            return session;
        }
    }
};

export type AppAuthOptions = typeof authOptions;
