/**
 * Audit Event Recorder (T052)
 * Minimal in-memory audit log to support early introspection and future persistence.
 * Each event captures actor (userId if known), action, and contextual data.
 *
 * Future enhancements:
 *  - Persist to Postgres (audit_events table) via db repo
 *  - Append request correlation id / ip / user-agent (privacy reviewed)
 *  - Structured query helpers for admin dashboards
 */
export interface AuditEventBase {
    id: string;          // unique id (timestamp-random)
    ts: string;          // ISO timestamp
    actor?: string;      // userId if authenticated
    action: string;      // domain action key e.g. subscription.checkout.requested
    ok: boolean;         // success flag
}

export type AuditEvent = AuditEventBase & Record<string, any>;

import { getAuditRepo } from '../db';
// Lazy-initialize the repo to avoid DB access at import time
let __auditRepo: ReturnType<typeof getAuditRepo> | null = null;
function repo() {
    if (!__auditRepo) __auditRepo = getAuditRepo();
    return __auditRepo;
}
const MAX_BUFFER = 500; // retained for interface parity (limit param enforced in repo slice)

function makeId() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }

export async function recordAudit(action: string, details: { actor?: string; ok?: boolean } & Record<string, any> = {}): Promise<AuditEvent> {
    const base: any = {
        id: makeId(),
        ts: new Date().toISOString(),
        action,
        ok: details.ok !== undefined ? details.ok : true,
        ...details
    };
    if (details.actor !== undefined) base.actor = details.actor;
    const evt: AuditEvent = base as AuditEvent;
    await repo().append({ type: action, ...(details.actor !== undefined ? { actor: details.actor } : {}), payload: evt });
    return evt;
}

export async function getRecentAudit(filter?: { actionPrefix?: string; actor?: string }): Promise<AuditEvent[]> {
    // Fetch a larger window then filter client-side to preserve existing semantics
    const raw = await repo().recent(MAX_BUFFER);
    let list = raw.map(r => ({
        id: makeId(), // repository does not supply id; generate ephemeral
        ts: r.ts,
        actor: r.actor,
        action: r.type,
        ok: true,
        ...(r.payload || {})
    })) as AuditEvent[];
    if (filter?.actionPrefix) {
        const p = filter.actionPrefix;
        list = list.filter(e => e.action.startsWith(p));
    }
    if (filter?.actor) list = list.filter(e => e.actor === filter.actor);
    return list;
}

export function clearAuditLog() { /* repository-scoped state lives externally; no-op */ }
