import { z } from "zod";

const envSchema = z.object({
    // Node
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // Core
    NEXT_PUBLIC_SITE_URL: z.string().url().min(1),
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),

    // Stripe (Optional - placeholders allowed in dev, but types serve as documentation)
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    BILLING_PORTAL_RETURN_URL: z.string().optional(),
    PREMIUM_PLAN_PRICE_ID: z.string().optional(),

    // AI (Future)
    OPENROUTER_API_KEY: z.string().optional(),
});

// Parse and validate on import
const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BILLING_PORTAL_RETURN_URL: process.env.BILLING_PORTAL_RETURN_URL,
    PREMIUM_PLAN_PRICE_ID: process.env.PREMIUM_PLAN_PRICE_ID,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    // In production, we strictly fail. In dev, we might tolerate some missing keys if we are just verifying.
    // But for "Foundation & Hygiene" we want to fail fast.
    if (process.env.NODE_ENV !== "test") {
        throw new Error("Invalid environment variables");
    }
}

export const env = parsed.success ? parsed.data : processEnv as z.infer<typeof envSchema>;

/**
 * Helper to check if Stripe is fully configured (real keys)
 * Mirrors the logic in old lib/config.ts
 */
export function isStripeConfigured(): boolean {
    return !!(
        env.STRIPE_SECRET_KEY &&
        env.STRIPE_SECRET_KEY.startsWith("sk_") &&
        env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY &&
        env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY.startsWith("pk_")
    );
}

/**
 * Accessor for AppConfig compatibility (Migration layer)
 */
export const config = {
    nodeEnv: env.NODE_ENV,
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
    billingEnabled: isStripeConfigured(),
    stripePublicKey: env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
    stripeSecretKey: env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    billingPortalReturnUrl: env.BILLING_PORTAL_RETURN_URL || '',
    premiumPlanPriceId: env.PREMIUM_PLAN_PRICE_ID || '',
};
