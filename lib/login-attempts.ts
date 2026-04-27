// lib/login-attempts.ts
// Track login attempts to prevent brute force attacks

interface LoginAttempt {
    attempts: number;
    lastAttemptTime: number;
    lockedUntil: number | null;
}

const loginAttemptsStore = new Map<string, LoginAttempt>();

const MAX_ATTEMPTS = 5; // Max login attempts
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes lockout

/**
 * Check if an email/identifier is locked out
 */
export function isLockedOut(identifier: string): boolean {
    const attempt = loginAttemptsStore.get(identifier);
    if (!attempt) return false;

    const now = Date.now();
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
        return true;
    }

    if (attempt.lockedUntil && now >= attempt.lockedUntil) {
        loginAttemptsStore.delete(identifier);
        return false;
    }

    return false;
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): {
    isLocked: boolean;
    remainingAttempts: number;
    lockoutUntil?: number;
} {
    const now = Date.now();
    const attempt = loginAttemptsStore.get(identifier) || {
        attempts: 0,
        lastAttemptTime: now,
        lockedUntil: null,
    };

    // Reset if outside the attempt window
    if (now - attempt.lastAttemptTime > ATTEMPT_WINDOW) {
        attempt.attempts = 0;
    }

    attempt.attempts++;
    attempt.lastAttemptTime = now;

    // Lock account after max attempts
    if (attempt.attempts >= MAX_ATTEMPTS) {
        attempt.lockedUntil = now + LOCKOUT_DURATION;
    }

    loginAttemptsStore.set(identifier, attempt);

    return {
        isLocked: attempt.attempts >= MAX_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_ATTEMPTS - attempt.attempts),
        lockoutUntil: attempt.lockedUntil || undefined,
    };
}

/**
 * Record a successful login (clear attempts)
 */
export function recordSuccessfulLogin(identifier: string): void {
    loginAttemptsStore.delete(identifier);
}

/**
 * Get remaining attempts for an identifier
 */
export function getRemainingAttempts(identifier: string): number {
    const attempt = loginAttemptsStore.get(identifier);
    if (!attempt) return MAX_ATTEMPTS;

    const now = Date.now();
    if (now - attempt.lastAttemptTime > ATTEMPT_WINDOW) {
        return MAX_ATTEMPTS;
    }

    return Math.max(0, MAX_ATTEMPTS - attempt.attempts);
}

/**
 * Cleanup old entries (call periodically)
 */
export function cleanupLoginAttempts(): void {
    const now = Date.now();
    for (const [key, attempt] of loginAttemptsStore.entries()) {
        // Remove entries older than the attempt window + lockout duration
        if (now - attempt.lastAttemptTime > ATTEMPT_WINDOW + LOCKOUT_DURATION) {
            loginAttemptsStore.delete(key);
        }
    }
}

// Cleanup every 10 minutes
setInterval(cleanupLoginAttempts, 10 * 60 * 1000);
