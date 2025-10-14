// Database adapter entry
// Mandatory DATABASE_URL; provides DB-backed repositories for subscriptions, audit, and webhooks.

export const persistenceFlagEnabled = () => !!process.env.DATABASE_URL;

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Set it to your Postgres connection string (see README Database setup).');
}

export interface SubscriptionRecord {
    userId: string;
    tier: 'free' | 'premium';
    status: 'active' | 'canceled' | 'none';
    currentPeriodEnd?: Date | null;
    cancellationScheduledAt?: Date | null;
    canceledAt?: Date | null;
}

export interface SubscriptionsRepo {
    get(userId: string): Promise<SubscriptionRecord | undefined>;
    upgradeToPremium(userId: string): Promise<SubscriptionRecord>;
    scheduleCancellation(userId: string, when: Date): Promise<void>;
    applyCancellationIfDue(userId: string, now?: Date): Promise<boolean>;
}

export interface AuditRepo {
    append(event: { type: string; actor?: string; payload?: any }): Promise<void>;
    recent(limit: number): Promise<Array<{ ts: string; type: string; actor?: string; payload?: any }>>;
}

export interface WebhookRepo {
    recordProcessed(id: string, type: string, userId?: string): Promise<{ duplicate: boolean }>;
    isProcessed(id: string): Promise<boolean>;
}

import { createDbWebhookRepo } from './webhookRepo';
import { createDbAuditRepo } from './auditRepo';

function time<T>(_name: string, fn: () => Promise<T>): Promise<T> {
    return fn();
}

let cachedDbPool: any = null;
let cachedDbQuery: ((sql: string, params: any[]) => Promise<{ rows: any[] }>) | null = null;
let dbQueryChain: Promise<any> = Promise.resolve();
const shouldSerializeDbQueries = () =>
    process.env.SERIALIZE_DB_QUERIES === '1' ||
    !!process.env.VITEST_WORKER_ID ||
    process.env.NODE_ENV === 'test';

function ensureDbQuery() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set for DB');
    if (!cachedDbQuery) {
        const { Pool } = require('pg');
        cachedDbPool = new Pool({ connectionString: process.env.DATABASE_URL });
        cachedDbQuery = async (sql: string, params: any[]) => {
            const run = async () => {
                const res = await cachedDbPool.query(sql, params);
                return { rows: res.rows };
            };
            if (shouldSerializeDbQueries()) {
                let out: { rows: any[] } = { rows: [] };
                dbQueryChain = dbQueryChain.then(async () => { out = await run(); });
                await dbQueryChain;
                return out;
            }
            return run();
        };
    }
    return cachedDbQuery;
}

function mapDbSubscription(row: any): SubscriptionRecord | undefined {
    if (!row) return undefined;
    const tier = row.tier === 'premium' ? 'premium' : 'free';
    const status: SubscriptionRecord['status'] = row.status === 'active' ? 'active' : (row.status === 'canceled' ? 'canceled' : 'none');
    return {
        userId: row.user_id,
        tier,
        status,
        currentPeriodEnd: row.current_period_end ? new Date(row.current_period_end) : null,
        cancellationScheduledAt: row.cancellation_scheduled_at ? new Date(row.cancellation_scheduled_at) : null,
        canceledAt: row.canceled_at ? new Date(row.canceled_at) : null
    };
}

export function getSubscriptionsRepo(): SubscriptionsRepo {
    return {
        async get(userId: string) {
            return time('repo.subscriptions.get', async () => {
                const run = ensureDbQuery();
                const { rows } = await run(
                    'SELECT user_id, tier, status, current_period_end, cancellation_scheduled_at, canceled_at FROM subscriptions WHERE user_id = $1',
                    [userId]
                );
                return mapDbSubscription(rows[0]);
            });
        },
        async upgradeToPremium(userId: string) {
            return time('repo.subscriptions.upgrade', async () => {
                const run = ensureDbQuery();
                const { rows } = await run(
                    `INSERT INTO subscriptions (user_id, tier, status, current_period_end, cancellation_scheduled_at, canceled_at)
					 VALUES ($1, 'premium', 'active', now() + interval '30 days', NULL, NULL)
					 ON CONFLICT (user_id)
					 DO UPDATE SET tier = 'premium', status = 'active', cancellation_scheduled_at = NULL, canceled_at = NULL, updated_at = now()
					 RETURNING user_id, tier, status, current_period_end, cancellation_scheduled_at, canceled_at`,
                    [userId]
                );
                return mapDbSubscription(rows[0])!;
            });
        },
        async scheduleCancellation(userId: string, when: Date) {
            return time('repo.subscriptions.scheduleCancellation', async () => {
                const run = ensureDbQuery();
                await run(
                    `UPDATE subscriptions
					 SET status = 'canceled', cancellation_scheduled_at = $2, updated_at = now()
					 WHERE user_id = $1`,
                    [userId, when.toISOString()]
                );
            });
        },
        async applyCancellationIfDue(userId: string, now: Date = new Date()) {
            return time('repo.subscriptions.applyCancellationIfDue', async () => {
                const run = ensureDbQuery();
                const sel = await run(
                    `SELECT cancellation_scheduled_at FROM subscriptions WHERE user_id = $1`,
                    [userId]
                );
                const raw = sel.rows[0]?.cancellation_scheduled_at;
                const when = raw ? new Date(raw) : null;
                if (!when) return false;
                if (when.getTime() <= now.getTime()) {
                    await run(
                        `UPDATE subscriptions
						 SET status = 'none', tier = 'free', canceled_at = $2, cancellation_scheduled_at = NULL, updated_at = now()
						 WHERE user_id = $1`,
                        [userId, when.toISOString()]
                    );
                    return true;
                }
                return false;
            });
        }
    };
}

let cachedDbAudit: AuditRepo | null = null;
export function getAuditRepo(): AuditRepo {
    if (!cachedDbAudit) {
        const baseRun = ensureDbQuery();
        const run = async (sql: string, params: any[]) => baseRun(sql, params);
        cachedDbAudit = createDbAuditRepo(run) as AuditRepo;
    }
    return cachedDbAudit;
}

let cachedDbWebhook: WebhookRepo | null = null;
export function getWebhookRepo(): WebhookRepo {
    if (!cachedDbWebhook) {
        const baseRun = ensureDbQuery();
        const run = async (sql: string, params: any[]) => baseRun(sql, params);
        cachedDbWebhook = createDbWebhookRepo(run) as WebhookRepo;
    }
    return cachedDbWebhook!;
}

// Legacy no-ops retained for API compatibility in tests; does nothing in DB mode
export function resetInMemoryPersistence() { /* no-op under mandatory DB */ }

