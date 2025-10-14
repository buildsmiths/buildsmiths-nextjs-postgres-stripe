// Error / response envelope utilities (T056)
// Provides consistent shape while allowing incremental opt-in.

export interface AppSuccess<T> { ok: true; data: T; meta?: Record<string, any>; }
export interface AppError { ok: false; error: { code: string; message: string; details?: any }; meta?: Record<string, any>; }

export function ok<T>(data: T, meta?: Record<string, any>): AppSuccess<T> {
    const out: any = { ok: true, data } as AppSuccess<T>;
    if (meta !== undefined) out.meta = meta;
    return out;
}
export function err(code: string, message: string, details?: any, meta?: Record<string, any>): AppError {
    const out: any = { ok: false, error: { code, message } } as AppError;
    if (details !== undefined) (out.error as any).details = details;
    if (meta !== undefined) out.meta = meta;
    return out;
}

export function envelopeEnabled() {
    // Envelope is the default response shape (always-on)
    return true;
}
