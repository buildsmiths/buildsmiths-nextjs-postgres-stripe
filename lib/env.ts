import { z } from "zod";

const envSchema = z.object({
    // Core
    NEXT_PUBLIC_SITE_URL: z.string().url().min(1),
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),

    // AI (Future)
    OPENROUTER_API_KEY: z.string().optional(),
});

// Parse and validate on import
const processEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables");
}

export const env = parsed.success ? parsed.data : processEnv as z.infer<typeof envSchema>;
