// Global test environment setup for required configuration env vars.
// Provides stub values so config validation passes in tests without hitting real services.
// If a test needs to simulate missing config, it can delete specific keys and call clearConfigCache().

process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test_secret';
process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_123';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_123';
process.env.BILLING_PORTAL_RETURN_URL = process.env.BILLING_PORTAL_RETURN_URL || 'http://localhost/account';
process.env.PREMIUM_PLAN_PRICE_ID = process.env.PREMIUM_PLAN_PRICE_ID || 'price_test_premium_123';

// Usage quotas removed; no usage limit envs required.

// Envelope is always-on; no RETURN_ENVELOPE toggle remains.

// Provide a default DATABASE_URL so the app can require it in all environments.
// The pg client is patched to an in-memory implementation by tests/setup/pg-mem.ts for node tests.
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://pg-mem/quickstart';
