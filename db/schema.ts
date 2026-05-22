import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
    userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    tier: text('tier').notNull(), // 'free' | 'premium'
    status: text('status').notNull(), // 'active' | 'canceled' | 'none'
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true, mode: 'string' }),
    cancellationScheduledAt: timestamp('cancellation_scheduled_at', { withTimezone: true, mode: 'string' }),
    canceledAt: timestamp('canceled_at', { withTimezone: true, mode: 'string' }),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const auditEvents = pgTable('audit_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    ts: timestamp('ts', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    actor: text('actor'),
    type: text('type').notNull(),
    payload: jsonb('payload'),
});