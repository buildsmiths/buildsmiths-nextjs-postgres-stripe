import dotenv from 'dotenv';
// Load environment variables with precedence
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import bcrypt from 'bcryptjs';
import pg from 'pg';

async function query(sql: string, params: any[] = []) {
    // Dynamic import to ensure env is loaded after dotenv
    const { env } = await import('@/lib/env');
    const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
    try {
        const res = await pool.query(sql, params);
        return { rows: res.rows };
    } finally {
        await pool.end();
    }
}

async function main() {
    // These keys are optional and specific to seeding, so we access process.env directly
    // rather than adding them to the global validation schema.
    const email = process.env.SEED_EMAIL || 'dev@example.com';
    const password = process.env.SEED_PASSWORD || 'Password123!';

    console.log(`Seeding user: ${email}`);

    const hash = await bcrypt.hash(password, 10);

    // upsert user
    const userRes = await query(
        `insert into users (email, password_hash)
         values ($1, $2)
         on conflict (email) do update set password_hash = excluded.password_hash
         returning id`,
        [email, hash]
    );

    const userId = userRes.rows[0]?.id;
    if (!userId) throw new Error('Failed to create or fetch user');

    // ensure a free subscription row exists
    await query(
        `insert into subscriptions (user_id, tier, status)
         values ($1, 'free', 'none')
         on conflict (user_id) do nothing`,
        [userId]
    );

    console.log(`✅ Seeded successfully.`);
    console.log(JSON.stringify({ email, userId }, null, 2));
}

main().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
