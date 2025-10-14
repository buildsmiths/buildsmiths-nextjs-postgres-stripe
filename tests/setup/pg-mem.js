// Patch the 'pg' module with an in-memory implementation using pg-mem for tests.
const { newDb } = require('pg-mem');

const db = newDb();

const initSql = `
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS webhook_events;

CREATE TABLE subscriptions (
  user_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('free','premium')),
  status TEXT NOT NULL CHECK (status IN ('active','canceled','none')),
  current_period_end TIMESTAMPTZ,
  cancellation_scheduled_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor TEXT,
  type TEXT NOT NULL,
  payload JSONB
);
CREATE INDEX idx_audit_events_ts ON audit_events(ts DESC);
CREATE INDEX idx_audit_events_actor ON audit_events(actor);
CREATE INDEX idx_audit_events_type ON audit_events(type);

CREATE TABLE webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id TEXT,
  duplicate BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_webhook_events_processed_at ON webhook_events(processed_at DESC);
CREATE INDEX idx_webhook_events_type ON webhook_events(type);
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

// vitest global hook compatibility: expose a cleanup before each test
const { beforeEach } = require('vitest');

beforeEach(() => {
    db.public.none(`
    DELETE FROM webhook_events;
    DELETE FROM audit_events;
    DELETE FROM subscriptions;
  `);
});
