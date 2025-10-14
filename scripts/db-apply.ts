import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load .env.local first (if present), then fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

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
