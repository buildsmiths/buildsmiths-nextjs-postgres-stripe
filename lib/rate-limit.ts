/**
 * Simple in-memory rate limiter (Token Bucket / Fixed Window hybrid).
 * Note: In a production serverless/cluster environment, use Redis (e.g. @upstash/ratelimit).
 * This implementation is sufficient for single-instance deployments.
 */

interface RateLimitOptions {
    interval: number; // Window size in ms
    uniqueTokenPerInterval?: number; // Max unique IPs to track before reset
}

export function rateLimit(options: RateLimitOptions) {
    const tokenCache = new Map<string, number[]>();
    const maxTokens = options.uniqueTokenPerInterval || 500;

    return {
        check: (limit: number, token: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const now = Date.now();
                const windowStart = now - options.interval;

                const timestamps = tokenCache.get(token) || [];
                const validTimestamps = timestamps.filter((ts) => ts > windowStart);

                if (validTimestamps.length >= limit) {
                    return reject(new Error('Rate limit exceeded'));
                }

                validTimestamps.push(now);
                tokenCache.set(token, validTimestamps);

                // Prevent memory leak
                if (tokenCache.size > maxTokens) {
                    tokenCache.clear();
                }

                resolve();
            });
        },
    };
}
