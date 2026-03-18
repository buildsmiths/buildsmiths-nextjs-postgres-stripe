/*
 * Application configuration loader & validator (T029)
 */

export interface AppConfig {
    siteUrl: string;
}

class ConfigError extends Error {
    issues: string[];
    constructor(issues: string[]) {
        super(`Configuration validation failed (\n  ${issues.join("\n  ")}\n)`);
        this.issues = issues;
    }
}

let cached: AppConfig | undefined;

// Required string env vars
const REQUIRED_BASE = [
    'NEXT_PUBLIC_SITE_URL',
];

function requireEnv(name: string, issues: string[], env: NodeJS.ProcessEnv): string {
    const v = env[name];
    if (!v || v.trim() === '') {
        issues.push(`Missing required env: ${name}`);
        return '';
    }
    return v.trim();
}

function mustBeUrl(name: string, value: string, issues: string[]) {
    if (!value) return;
    try {
        new URL(value);
    } catch {
        issues.push(`Env ${name} must be a valid URL (got: ${value})`);
    }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    if (cached) return cached as AppConfig;

    const issues: string[] = [];
    const values: Record<string, string | undefined> = {};

    // Base required values
    for (const key of REQUIRED_BASE) {
        values[key] = requireEnv(key, issues, env);
    }

    // URL validations
    if (values.NEXT_PUBLIC_SITE_URL) {
        mustBeUrl('NEXT_PUBLIC_SITE_URL', values.NEXT_PUBLIC_SITE_URL, issues);
    }

    if (issues.length) {
        throw new ConfigError(issues);
    }

    const built: AppConfig = {
        siteUrl: values.NEXT_PUBLIC_SITE_URL!,
    };
    
    cached = built;
    return built;
}

export function clearConfigCache() {
    cached = undefined;
}

export { ConfigError };
