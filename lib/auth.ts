import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { db } from './db';
import { users } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { eq, sql } from 'drizzle-orm';

const providers: any[] = [
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
            
            const userRows = await db.select({
                id: users.id,
                email: users.email,
                password_hash: users.passwordHash
            })
            .from(users)
            .where(sql`lower(${users.email}) = lower(${email})`)
            .limit(1);

            const user = userRows[0];
            if (!user) return null;
            const ok = await compare(password, user.password_hash);
            return ok ? { id: user.id, email: user.email } : null;
        }
    })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }));
}

export const authOptions = {
    session: { strategy: 'jwt' as const },
    pages: {
        signIn: '/auth',
        error: '/auth'
    },
    providers,
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

export interface AuthSession {
    userId: string;
    email?: string;
}

export async function getServerAuthSession(): Promise<AuthSession | null> {
    try {
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
