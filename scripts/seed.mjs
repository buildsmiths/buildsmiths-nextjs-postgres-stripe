#!/usr/bin/env node
import bcrypt from 'bcryptjs';
import pg from 'pg';

async function query(sql, params = []) {
    const cn = process.env.DATABASE_URL;
    if (!cn) throw new Error('DATABASE_URL is required');
    const pool = new pg.Pool({ connectionString: cn });
    try {
        const res = await pool.query(sql, params);
        return { rows: res.rows };
    } finally {
        await pool.end();
    }
}

async function main() {
    const email = process.env.SEED_EMAIL || 'dev@example.com';
    const password = process.env.SEED_PASSWORD || 'Password123!';
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

    console.log(JSON.stringify({ email, userId }, null, 2));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
