import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables with clear precedence:
// 1) Existing process.env wins (what the shell provided)
// 2) Non-empty values from .env.local override .env
// 3) Non-empty values from .env fill any remaining gaps
// This avoids a footgun where an empty var in .env.local blocks fallback to .env.
(function loadEnv() {
    const cwd = process.cwd();
    const initial = { ...process.env };

    const parseIfExists = (file: string) => {
        const p = path.resolve(cwd, file);
        if (!fs.existsSync(p)) return {} as Record<string, string>;
        try {
            const content = fs.readFileSync(p, 'utf8');
            return dotenv.parse(content);
        } catch {
            return {} as Record<string, string>;
        }
    };

    const envBase = parseIfExists('.env');
    const envLocal = parseIfExists('.env.local');

    // Helper to apply entries
    const apply = (
        entries: Record<string, string>,
        opts: { override: boolean }
    ) => {
        for (const [k, v] of Object.entries(entries)) {
            const next = (v ?? '').trim();
            if (!next) continue; // ignore empty assignments

            const hadInitial = Object.prototype.hasOwnProperty.call(initial, k) && (initial[k] ?? '') !== '';
            if (hadInitial) continue; // never override what the shell provided

            if (opts.override) {
                process.env[k] = next; // allow override from higher-precedence source
            } else {
                if ((process.env[k] ?? '') === '') {
                    process.env[k] = next; // fill only if unset/empty
                }
            }
        }
    };

    // Apply .env first (fill gaps), then .env.local (override with non-empty), leaving shell vars intact
    apply(envBase, { override: false });
    apply(envLocal, { override: true });
})();

async function main() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error('DATABASE_URL is required');
    }

    const sqlFile = process.argv[2] || 'db/init.sql';
    const sqlPath = path.resolve(process.cwd(), sqlFile);
    if (!fs.existsSync(sqlPath)) {
        throw new Error(`SQL file not found: ${sqlPath}`);
    }
    await new Promise<void>((resolve, reject) => {
        const child = spawn('psql', ['-d', dbUrl, '-f', sqlPath], { stdio: 'inherit' });
        child.on('exit', (code) => {
            if (code === 0) {
                console.log(`Applied schema from ${sqlFile}`);
                resolve();
            } else {
                reject(new Error(`psql exited with code ${code}`));
            }
        });
        child.on('error', (err) => reject(err));
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
