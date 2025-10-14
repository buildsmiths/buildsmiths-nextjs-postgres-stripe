/*
 * Application configuration loader & validator (T029)
 */

export interface AppConfig {
    nodeEnv: string;
    siteUrl: string;
    billingEnabled: boolean; // deprecated: mirrors isStripeConfigured()
    stripePublicKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    billingPortalReturnUrl: string;
    premiumPlanPriceId: string;
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
const REQUIRED_STRIPE = [
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'BILLING_PORTAL_RETURN_URL',
    'PREMIUM_PLAN_PRICE_ID'
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

// no numeric usage limits in simplified template

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    if (cached) return cached as AppConfig;

    const issues: string[] = [];

    const values: Record<string, string | undefined> = {};
    // Base required values
    for (const key of REQUIRED_BASE) {
        values[key] = requireEnv(key, issues, env);
    }

    // Read Stripe-related values if present (placeholders allowed). We'll validate only when configured.
    for (const key of REQUIRED_STRIPE) {
        values[key] = (env[key] || '').trim();
    }

    // URL validations
    if (values.NEXT_PUBLIC_SITE_URL) {
        mustBeUrl('NEXT_PUBLIC_SITE_URL', values.NEXT_PUBLIC_SITE_URL, issues);
    }
    // Validate billing portal return URL only when Stripe is configured (real keys)
    const configured = isStripeConfigured(env);
    if (configured) {
        if (values.BILLING_PORTAL_RETURN_URL) {
            mustBeUrl('BILLING_PORTAL_RETURN_URL', values.BILLING_PORTAL_RETURN_URL, issues);
        }
    }

    if (issues.length) {
        throw new ConfigError(issues);
    }

    const built: AppConfig = {
        nodeEnv: env.NODE_ENV || 'development',
        siteUrl: values.NEXT_PUBLIC_SITE_URL!,
        billingEnabled: configured, // mirror isStripeConfigured (legacy field)
        stripePublicKey: values.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
        stripeSecretKey: values.STRIPE_SECRET_KEY || '',
        stripeWebhookSecret: values.STRIPE_WEBHOOK_SECRET || '',
        billingPortalReturnUrl: values.BILLING_PORTAL_RETURN_URL || '',
        premiumPlanPriceId: values.PREMIUM_PLAN_PRICE_ID || ''
    };
    cached = built;
    return built;
}

export function clearConfigCache() {
    cached = undefined;
}

export { ConfigError };

// Helper: infer if Stripe is configured with non-placeholder values (zero-config billing)
export function isStripeConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    const pk = (env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '').trim();
    const sk = (env.STRIPE_SECRET_KEY || '').trim();
    const price = (env.PREMIUM_PLAN_PRICE_ID || '').trim();
    const isPlaceholder = (s: string) => !s || /placeholder/i.test(s);
    return !isPlaceholder(pk) && !isPlaceholder(sk) && !isPlaceholder(price);
}
