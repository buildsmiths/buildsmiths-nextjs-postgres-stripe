// Use runtime require to avoid ESM type frictions in bundler resolution
import pg from 'pg';

let pool: pg.Pool | null = null;

// Configuration for robust connection handling
const POOL_CONFIG: pg.PoolConfig = {
    // For Vercel/Serverless deployments, use your provider's "Transaction Pooler" connection string (port 6543)
    // to avoid exhausting connections. The standard pg driver works perfectly with transaction poolers.
    // Example: postgres://user:pass@host:6543/db?pgbouncer=true

    max: 20, // Max clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30s
    connectionTimeoutMillis: 5000, // Fail if connection takes >5s
};

export function getPool(): pg.Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) throw new Error('DATABASE_URL is required');

        pool = new pg.Pool({
            connectionString,
            ...POOL_CONFIG
        });

        // Error handler for idle clients to avoid "uncaughtException"
        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            // Don't process.exit(1), just log. 
        });
    }
    return pool!;
}

export async function query<T = any>(sql: string, params: any[] = []) {
    const p = getPool();
    const res = await p.query(sql, params);
    return { rows: res.rows as T[] };
}
