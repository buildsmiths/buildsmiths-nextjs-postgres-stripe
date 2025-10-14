// Pure Node version of db-apply (no tsx required)
// Loads envs with precedence: Shell > .env.local (non-empty) > .env (non-empty)
// Then runs `psql` against the provided SQL file (default db/init.sql).

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';

function loadEnvWithPrecedence() {
    const cwd = process.cwd();
    const initial = { ...process.env };

    const parseIfExists = (file) => {
        const p = path.resolve(cwd, file);
        if (!fs.existsSync(p)) return {};
        try {
            const content = fs.readFileSync(p, 'utf8');
            return dotenv.parse(content);
        } catch {
            return {};
        }
    };

    const envBase = parseIfExists('.env');
    const envLocal = parseIfExists('.env.local');

    const apply = (entries, { override }) => {
        for (const [k, v] of Object.entries(entries)) {
            const next = (v ?? '').trim();
            if (!next) continue; // ignore empty assignments
            const hadInitial = Object.prototype.hasOwnProperty.call(initial, k) && (initial[k] ?? '') !== '';
            if (hadInitial) continue; // never override shell-provided
            if (override) {
                process.env[k] = next;
            } else if ((process.env[k] ?? '') === '') {
                process.env[k] = next;
            }
        }
    };

    // Fill from .env, then override from .env.local; keep shell values
    apply(envBase, { override: false });
    apply(envLocal, { override: true });
}

async function run() {
    loadEnvWithPrecedence();
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error('DATABASE_URL is required');
    }

    const sqlFile = process.argv[2] || 'db/init.sql';
    const sqlPath = path.resolve(process.cwd(), sqlFile);
    if (!fs.existsSync(sqlPath)) {
        throw new Error(`SQL file not found: ${sqlPath}`);
    }

    const client = new pg.Client({ connectionString: dbUrl });
    await client.connect();
    try {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        // naive split by semicolon, ignoring whitespace-only chunks
        const statements = sql
            .split(/;\s*\n|;\s*$/gm)
            .map((s) => s.trim())
            .filter(Boolean);

        for (const stmt of statements) {
            try {
                await client.query(stmt);
            } catch (err) {
                const msg = (err && err.message) ? String(err.message) : '';
                const code = err && err.code ? String(err.code) : '';
                // If pgcrypto creation fails due to perms, warn and continue
                if (/create\s+extension/i.test(stmt) && (code === '42501' || /must be superuser|permission denied/i.test(msg))) {
                    console.warn('Warning: Could not create extension pgcrypto (insufficient privileges). Continuing.');
                    continue;
                }
                throw err;
            }
        }
        console.log(`Applied schema from ${sqlFile}`);
    } finally {
        await client.end();
    }
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
