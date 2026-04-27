// lib/rate-limiter.ts
// Simple in-memory rate limiter for server-side operations

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiter for server actions
 * @param key - Unique identifier (userId, IP, etc.)
 * @param limit - Max requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
    key: string,
    limit: number = 10,
    windowMs: number = 60000, // 1 minute
): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return true;
    }

    if (entry.count < limit) {
        entry.count++;
        return true;
    }

    return false;
}

/**
 * Get remaining requests for a key
 */
export function getRateLimitRemaining(key: string, limit: number = 10): number {
    const entry = rateLimitStore.get(key);
    if (!entry || Date.now() > entry.resetTime) {
        return limit;
    }
    return Math.max(0, limit - entry.count);
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
    rateLimitStore.delete(key);
}

/**
 * Cleanup old entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
