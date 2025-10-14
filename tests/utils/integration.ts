// Shared integration test utilities (T077)
// Provides helpers to invoke Next.js route handlers directly with minimal boilerplate.

interface MockRequestInit {
    method?: string;
    headers?: Record<string, string>;
    body?: any; // will be JSON.stringified if object
}

export function makeJsonRequest(body: any, headers: Record<string, string> = {}) {
    const raw = JSON.stringify(body);
    return {
        headers: { get: (k: string) => headers[k.toLowerCase()] },
        text: async () => raw,
    } as any;
}

export function makeApiRequest(init: MockRequestInit = {}) {
    const { method = 'GET', headers = {}, body } = init;
    let stringBody: string | undefined;
    if (body !== undefined) {
        stringBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
    return {
        method,
        headers: { get: (k: string) => headers[k.toLowerCase()] },
        json: async () => body,
        text: async () => stringBody ?? '',
    } as any;
}

export async function readJson(res: Response | any) {
    if (typeof res.json === 'function') {
        return await res.json();
    }
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return txt; }
}
