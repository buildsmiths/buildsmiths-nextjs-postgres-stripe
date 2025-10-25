// Aggregated reset helpers for integration tests (T078)
// Centralizes clearing all in-memory singletons so each integration test starts clean.

import { clearProcessedWebhookIds } from '@/lib/stripe/webhook';
import { clearAllSubscriptions } from '@/lib/subscriptions/store';
import { resetInMemoryPersistence } from '@/lib/db';

// Placeholder for future subscription store reset once implemented.
export function resetSubscriptions() { clearAllSubscriptions(); }

export function resetAllState() {
    // usage reset removed in Phase 1
    clearProcessedWebhookIds();
    resetSubscriptions();
    resetInMemoryPersistence();
}
