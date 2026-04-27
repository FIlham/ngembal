// lib/sanitizer.ts
// Input sanitization utilities to prevent XSS attacks

/**
 * Sanitize user input by escaping HTML special characters
 * This is the safer approach for plain text content
 */
export function sanitizeHtml(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Sanitize plain text content - only removes dangerous characters
 * Safe for displaying user-generated text
 */
export function sanitizeText(input: string): string {
    if (!input) return "";

    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

/**
 * Validate and sanitize text content (like comments, threads)
 */
export function sanitizeUserContent(content: string): string {
    // Remove any potential HTML/JavaScript
    return content
        .trim()
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ""); // Remove event handlers
}

/**
 * Validate thread or comment content
 */
export function validateContentSafety(content: string): {
    isValid: boolean;
    sanitized: string;
    error?: string;
} {
    if (!content || typeof content !== "string") {
        return {
            isValid: false,
            sanitized: "",
            error: "Content must be a string",
        };
    }

    const trimmed = content.trim();

    if (trimmed.length === 0) {
        return {
            isValid: false,
            sanitized: "",
            error: "Content cannot be empty",
        };
    }

    if (trimmed.length > 5000) {
        return {
            isValid: false,
            sanitized: "",
            error: "Content is too long (max 5000 characters)",
        };
    }

    const sanitized = sanitizeUserContent(trimmed);

    // Check if content is still valid after sanitization
    if (sanitized.trim().length === 0) {
        return {
            isValid: false,
            sanitized: "",
            error: "Content contains only invalid characters",
        };
    }

    return {
        isValid: true,
        sanitized,
    };
}

/**
 * Check for potential XSS patterns
 */
export function containsXSSPatterns(content: string): boolean {
    const xssPatterns = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /on\w+\s*=/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /data:text\/html/gi,
        /<iframe/gi,
        /<embed/gi,
        /<object/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(content));
}
