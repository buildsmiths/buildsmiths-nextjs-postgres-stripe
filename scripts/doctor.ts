import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { z } from 'zod';

// Load envs manually for the check
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

console.log('🩺  Running Buildsmiths Doctor...\n');

// 1. Check Env Files
console.log('1. Checking Environment Files...');
if (fs.existsSync(envLocalPath)) {
    console.log('   ✅ .env.local found');
    dotenv.config({ path: '.env.local' });
} else if (fs.existsSync(envPath)) {
    console.log('   ✅ .env found');
    dotenv.config({ path: '.env' });
} else {
    console.error('   ❌ No .env or .env.local file found.');
    console.log('      👉 Copy .env.example to .env.local');
}

// 2. Check Env Variables
console.log('\n2. Checking Environment Variables...');
// Dynamic import to avoid hoisting issues, but we want to catch the error locally
async function checkEnv() {
    try {
        const { env, isStripeConfigured } = await import('@/lib/env');
        console.log('   ✅ Environment variables are valid.');

        if (isStripeConfigured()) {
            console.log('   ✅ Stripe is configured.');
        } else {
            console.log('   ℹ️  Stripe is NOT configured (Billing disabled).');
        }
        return env;
    } catch (e) {
        console.error('   ❌ Environment validation failed.');
        return null;
    }
}

// 3. Check Database Connection
async function checkDb(connectionString: string) {
    console.log('\n3. Checking Database Connection...');
    const client = new pg.Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log(`   ✅ Database connected: ${res.rows[0].now}`);
        await client.end();
        return true;
    } catch (err: any) {
        console.error(`   ❌ Database connection failed: ${err.message}`);
        return false;
    }
}

async function main() {
    const env = await checkEnv();
    if (env) {
        await checkDb(env.DATABASE_URL);
    }
    console.log('\nDone.');
}

main();
