import { newDb } from 'pg-mem';

// Single in-memory DB shared across tests
const db = newDb();

const initSql = `
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('free','premium')),
  status TEXT NOT NULL CHECK (status IN ('active','canceled','none')),
  current_period_end TIMESTAMPTZ,
  cancellation_scheduled_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor TEXT,
  type TEXT NOT NULL,
  payload JSONB
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

const adapters = db.adapters.createPg();
export const Pool = adapters.Pool;

export function __resetPgMem() {
    db.public.none(`
    DELETE FROM webhook_events;
    DELETE FROM audit_events;
    DELETE FROM subscriptions;
  `);
}
