import pg from 'pg';

let pool: pg.Pool | null = null;

const POOL_CONFIG: pg.PoolConfig = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

export function getPool(): pg.Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) throw new Error('DATABASE_URL is required');

        pool = new pg.Pool({
            connectionString,
            ...POOL_CONFIG
        });

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
        });
    }
    return pool!;
}

export async function query<T = any>(sql: string, params: any[] = []) {
    const p = getPool();
    const res = await p.query(sql, params);
    return { rows: res.rows as T[] };
}
