import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables with precedence:
// 1. Shell (already in process.env)
// 2. .env.local (if exists) - loaded first by dotenv, won't overwrite shell
// 3. .env (if exists) - loaded second, won't overwrite shell or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// We must import env AFTER loading variables, otherwise validation might fail
// Dynamic import to avoid hoisting issues
// import { env } from '@/lib/env';

async function run() {
    // Import env dynamically so dotenv has time to load
    const { env } = await import('@/lib/env');

    const sqlFile = process.argv[2] || 'db/init.sql';
    const sqlPath = path.resolve(process.cwd(), sqlFile);

    if (!fs.existsSync(sqlPath)) {
        console.error(`❌ SQL file not found: ${sqlPath}`);
        process.exit(1);
    }

    console.log(`Connecting to database...`);
    const client = new pg.Client({ connectionString: env.DATABASE_URL });

    try {
        await client.connect();

        const sql = fs.readFileSync(sqlPath, 'utf8');
        // Split by semicolon, ignoring whitespace-only chunks
        const statements = sql
            .split(/;\s*\n|;\s*$/gm)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        console.log(`Applying ${statements.length} statements from ${sqlFile}...`);

        for (const stmt of statements) {
            try {
                await client.query(stmt);
            } catch (err: any) {
                // If pgcrypto creation fails due to perms, warn and continue
                const isExtensionError = /create\s+extension/i.test(stmt);
                const isPermError = err.code === '42501' || /must be superuser|permission denied/i.test(err.message || '');

                if (isExtensionError && isPermError) {
                    console.warn('⚠️  Warning: Could not create extension pgcrypto (insufficient privileges). Continuing, assuming it is already installed.');
                    continue;
                }
                throw err;
            }
        }
        console.log(`✅ Applied schema successfully.`);
    } catch (err) {
        console.error('❌ Failed to apply schema:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
