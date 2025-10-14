// DB reset hook for tests: when DATABASE_URL is present, clear tables between runs.
// Ensures each test runs with a clean database state by truncating tables (inline SQL below).

import { beforeEach } from 'vitest';

let resetFn: null | (() => Promise<void>) = null;

async function initReset() {
    if (resetFn !== null) return;
    if (!process.env.DATABASE_URL) {
        resetFn = async () => { };
        return;
    }
    try {
        // use require to avoid TS type resolution hiccups in test env
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        resetFn = async () => {
            // Use a single transaction and TRUNCATE with CASCADE where appropriate
            // Order chosen to satisfy FK dependencies if added later
            await pool.query('BEGIN');
            try {
                await pool.query('TRUNCATE TABLE webhook_events RESTART IDENTITY CASCADE');
                // usage_counters removed in Phase 1
                await pool.query('TRUNCATE TABLE subscriptions RESTART IDENTITY CASCADE');
                await pool.query('COMMIT');
            } catch (e) {
                await pool.query('ROLLBACK');
                throw e;
            }
        };
    } catch {
        // If pg isn't available for some reason, make reset a no-op
        resetFn = async () => { };
    }
}

beforeEach(async () => {
    await initReset();
    await resetFn!();
});
