/**
 * subscriptionState.ts
 * Central place to derive a unified subscription + tier state for a request.
 * This will later integrate with NextAuth session + database-backed subscription records.
 * For now it normalizes the existing header-based mock convention used in tests.
 */
import { getEffectiveTier, SessionLike as PolicySessionLike } from './policy';
import { getSubscriptionAsync } from '../subscriptions/store';
import { getServerAuthSession } from '../auth/session';

export interface SubscriptionState {
  authenticated: boolean;
  tier: string; // effective tier derived from policy logic
  rawSession: (PolicySessionLike & { email?: string }) | null;
  // Optional enriched subscription details when available (e.g., DB-backed repo)
  subscription?: {
    currentPeriodEnd?: Date | null;
  } | null;
}

/**
 * getMockSessionFromHeaders
 * Isolates the current mock header contract so that when real auth is introduced
 * only this function (or its caller) needs to change.
 */
type RequestLike = { headers: { get: (name: string) => string | null } };

export function getMockSessionFromHeaders(req: RequestLike): PolicySessionLike | null {
  const userId = req.headers.get('x-user-id');
  if (!userId) return null;
  const premium = req.headers.get('x-user-premium') === 'true';
  return {
    userId,
    subscriptionStatus: premium ? 'active' : 'none',
    subscriptionTier: premium ? 'premium' : 'free'
  };
}

/**
 * deriveSubscriptionState
 * Future evolution:
 *  - Fetch NextAuth session
 *  - Lookup active subscription in DB (subscriptions table)
 *  - Compute effective tier (grace periods, trials, etc.)
 */
export async function deriveSubscriptionStateAsync(req: RequestLike): Promise<SubscriptionState> {
  // If headers are present, honor them; enrich from store when premium isn't explicitly set
  const headerSession = getMockSessionFromHeaders(req);
  if (headerSession) {
    let session: PolicySessionLike | null = headerSession;
    const premiumHeader = req.headers.get('x-user-premium');
    let storeRec: any = null;
    if (premiumHeader === null) {
      storeRec = await getSubscriptionAsync(headerSession.userId!);
      if (storeRec) {
        session = {
          userId: headerSession.userId!,
          subscriptionTier: storeRec.tier === 'premium' ? 'premium' : 'free',
          subscriptionStatus: storeRec.status === 'active' ? 'active' : 'none'
        };
      }
    }
    const tier = getEffectiveTier(session);
    const subscription = storeRec ? { currentPeriodEnd: (storeRec as any).currentPeriodEnd ?? null } : null;
    return { authenticated: !!session, tier, rawSession: session, subscription };
  }

  // Otherwise, try server session via NextAuth
  const auth = await getServerAuthSession(req as any);
  let session: PolicySessionLike | null = null;
  let storeRec: any = null;
  if (auth) {
    storeRec = await getSubscriptionAsync(auth.userId);
    if (storeRec) {
      session = {
        userId: auth.userId,
        email: auth.email,
        subscriptionTier: storeRec.tier === 'premium' ? 'premium' : 'free',
        subscriptionStatus: storeRec.status === 'active' ? 'active' : 'none'
      } as any;
    } else {
      session = { userId: auth.userId, email: auth.email, subscriptionTier: 'free', subscriptionStatus: 'none' } as any;
    }
  }

  const tier = getEffectiveTier(session);
  // Enrich with subscription details if storeRec exists
  const subscription = storeRec ? { currentPeriodEnd: (storeRec as any).currentPeriodEnd ?? null } : null;
  return { authenticated: !!session, tier, rawSession: session, subscription };
}
