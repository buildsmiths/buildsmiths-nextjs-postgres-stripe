import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema';

let pool: pg.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

const POOL_CONFIG: pg.PoolConfig = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

export function getPool(): pg.Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL || 'postgres://dummy:dummy@localhost/dummy';
        // if (!connectionString) throw new Error('DATABASE_URL is required');

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

export function getDb() {
    if (!dbInstance) {
        dbInstance = drizzle(getPool(), { schema });
    }
    return dbInstance;
}

export const db = getDb();
