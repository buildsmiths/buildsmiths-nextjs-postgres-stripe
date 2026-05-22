import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { users, subscriptions } from '../db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const email = process.env.SEED_EMAIL || 'dev@example.com';
    const password = process.env.SEED_PASSWORD || 'Password123!';

    console.log(`Seeding user: ${email}`);

    const hash = await bcrypt.hash(password, 10);

    let user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(res => res[0]);
    
    if (user) {
        await db.update(users).set({ passwordHash: hash }).where(eq(users.id, user.id));
    } else {
        const insertRes = await db.insert(users).values({ email, passwordHash: hash }).returning({ id: users.id });
        user = insertRes[0] as any;
    }

    const userId = user?.id;
    if (!userId) throw new Error('Failed to create or fetch user');

    const existingSub = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1).then(res => res[0]);
    if (!existingSub) {
        await db.insert(subscriptions).values({ userId, tier: 'free', status: 'none' });
    }

    console.log(`✅ Seeded successfully.`);
    console.log(JSON.stringify({ email, userId }, null, 2));
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
