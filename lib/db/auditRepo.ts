export interface QueryRunner {
    (sql: string, params: any[]): Promise<{ rows: any[] }>
}

export function createDbAuditRepo(run: QueryRunner) {
    return {
        async append(event: { type: string; actor?: string; payload?: any }) {
            await run(
                'INSERT INTO audit_events (actor, type, payload) VALUES ($1, $2, $3)',
                [event.actor || null, event.type, event.payload ? JSON.stringify(event.payload) : null]
            );
        },
        async recent(limit: number) {
            const res = await run(
                'SELECT ts, actor, type, payload FROM audit_events ORDER BY ts DESC LIMIT $1',
                [limit]
            );
            return res.rows.map(r => ({
                ts: r.ts instanceof Date ? r.ts.toISOString() : r.ts,
                actor: r.actor || undefined,
                type: r.type,
                payload: typeof r.payload === 'string' ? safeParse(r.payload) : r.payload
            }));
        }
    };
}

function safeParse(json: string) {
    try { return JSON.parse(json); } catch { return undefined; }
}

export type DbAuditRepo = ReturnType<typeof createDbAuditRepo>;
