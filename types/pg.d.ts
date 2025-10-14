// Minimal module declaration for pg to satisfy TypeScript in tests context.
declare module 'pg' {
  interface QueryResult<R = any> { rows: R[] }
  class Client {
    constructor(config: { connectionString?: string });
    connect(): Promise<void>;
    end(): Promise<void>;
    query<R = any>(sql: string, params?: any[]): Promise<QueryResult<R>>;
  }
  export { Client };
}
