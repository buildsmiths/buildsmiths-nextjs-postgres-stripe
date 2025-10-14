/**
 * Subscription domain facade
 * Thin async wrapper over DB-backed repositories for upgrade/cancel/apply flows.
 * Keeps call sites stable while letting repos evolve.
 */

export type SubscriptionStatus = 'none' | 'active' | 'canceled';

export interface SubscriptionRecord {
    userId: string;
    tier: string; // 'free' | 'premium' (extensible)
    status: SubscriptionStatus;
    cancelAt?: string; // ISO timestamp when cancellation becomes effective
    updatedAt: string;
}

// Legacy in-memory map replaced by persistence layer repositories (T085)
// Keep a thin compatibility layer so existing callers remain unchanged while
// underlying storage migrates. The in-memory repository currently mirrors this behavior.
import { getSubscriptionsRepo, resetInMemoryPersistence } from '../db';

const repo = getSubscriptionsRepo();

export function clearAllSubscriptions() { resetInMemoryPersistence(); }

// --- Async-first APIs (prepare to replace sync helpers) ---
// These use the repository directly and should be awaited by callers/tests.

export async function getSubscriptionAsync(userId: string) { return repo.get(userId) as any; }

export async function upgradeToPremiumAsync(userId: string) { return repo.upgradeToPremium(userId) as any; }

export async function scheduleCancellationAsync(userId: string, effectiveDate: Date) { await repo.scheduleCancellation(userId, effectiveDate); }

export async function applyCancellationIfDueAsync(userId: string, now = new Date()) { return repo.applyCancellationIfDue(userId, now); }

/**
 * DEPRECATION NOTE:
 * The module is now async-only. All call sites should await the functions here to ensure a
 * single async-first source of truth via the repository.
 */
