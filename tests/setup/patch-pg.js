// Replace 'pg' module with an in-memory implementation (pg-mem) for tests.
const { newDb } = require('pg-mem');
const { randomUUID } = require('crypto');

const db = newDb();

// Provide gen_random_uuid() like pgcrypto for default UUIDs
db.public.registerFunction({
  name: 'gen_random_uuid',
  args: [],
  returns: 'uuid',
  implementation: () => randomUUID(),
  impure: true, // mark as volatile so pg-mem doesn't memoize the result
});

const initSql = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free','premium')),
  status TEXT NOT NULL CHECK (status IN ('active','canceled','none')),
  current_period_end TIMESTAMPTZ,
  cancellation_scheduled_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Match real schema: id uuid pk default gen_random_uuid(), ts default now(), non-empty type
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor TEXT,
  type TEXT NOT NULL,
  payload JSONB,
  CHECK (type <> '')
);
CREATE INDEX IF NOT EXISTS idx_audit_events_ts ON audit_events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor);
CREATE INDEX IF NOT EXISTS idx_audit_events_type ON audit_events(type);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id TEXT,
  duplicate BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(type);
`;

db.public.none(initSql);

const { Pool } = db.adapters.createPg();

const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'pg') {
    return { Pool };
  }
  return originalRequire.apply(this, arguments);
};
