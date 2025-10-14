export interface QueryResult<Row = any> { rows: Row[] }
export type QueryRunner = (sql: string, params: any[]) => Promise<QueryResult>;

export interface DbWebhookRow {
    id: string;
    type: string;
    user_id?: string | null;
    duplicate: boolean;
    processed_at?: string;
}

export function createDbWebhookRepo(run: QueryRunner) {
    return {
        async recordProcessed(id: string, type: string, userId?: string) {
            const sql = `INSERT INTO webhook_events (id, type, user_id, duplicate)
				   VALUES ($1, $2, $3, false)
				   ON CONFLICT (id) DO UPDATE SET duplicate = true
				   RETURNING duplicate`;
            const { rows } = await run(sql, [id, type, userId ?? null]);
            const duplicate = rows[0]?.duplicate === true;
            return { duplicate };
        },
        async isProcessed(id: string) {
            const sql = `SELECT 1 FROM webhook_events WHERE id = $1 LIMIT 1`;
            const { rows } = await run(sql, [id]);
            return rows.length > 0;
        }
    };
}

export type DbWebhookRepo = ReturnType<typeof createDbWebhookRepo>;
