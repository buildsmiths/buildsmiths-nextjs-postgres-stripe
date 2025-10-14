// Use runtime require to avoid ESM type frictions in bundler resolution
const { Pool } = require('pg');

let pool: any | null = null;
function getPool() {
    if (!pool) {
        const cn = process.env.DATABASE_URL;
        if (!cn) throw new Error('DATABASE_URL is required');
        pool = new Pool({ connectionString: cn });
    }
    return pool;
}

export async function query<T = any>(sql: string, params: any[] = []) {
    const p = getPool();
    const res = await p.query(sql, params);
    return { rows: res.rows as T[] };
}
