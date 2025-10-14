/**
 * Structured logging helper (T030)
 * Simple console-backed logger with context + level + timestamp.
 * In future this can be swapped for pino/winston without changing call sites.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogFields {
    [key: string]: unknown;
}

export interface LogEntry extends LogFields {
    level: LogLevel;
    msg: string;
    time: string; // ISO string
}

export class Logger {
    private context: LogFields;

    constructor(context: LogFields = {}) {
        this.context = { ...context };
    }

    child(extra: LogFields): Logger {
        return new Logger({ ...this.context, ...extra });
    }

    private emit(level: LogLevel, msg: string, meta?: LogFields) {
        const entry: LogEntry = {
            time: new Date().toISOString(),
            level,
            msg,
            ...this.context,
            ...(meta || {})
        };
        // Choose console method by level
        const line = JSON.stringify(entry);
        switch (level) {
            case 'debug':
                console.debug(line);
                break;
            case 'info':
                console.info(line);
                break;
            case 'warn':
                console.warn(line);
                break;
            case 'error':
                console.error(line);
                break;
        }
    }

    debug(msg: string, meta?: LogFields) { this.emit('debug', msg, meta); }
    info(msg: string, meta?: LogFields) { this.emit('info', msg, meta); }
    warn(msg: string, meta?: LogFields) { this.emit('warn', msg, meta); }
    error(msg: string, meta?: LogFields) { this.emit('error', msg, meta); }
}

// Root logger
export const log = new Logger();

// For testing / future extension hook
export function createLogger(context: LogFields) { return new Logger(context); }
