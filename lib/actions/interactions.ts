"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/database";
import { comments, likes } from "@/database/schema";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateContentSafety } from "@/lib/sanitizer";

export async function toggleLikeAction(threadId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // Rate limiting: max 100 like toggles per hour per user
    if (
        !checkRateLimit(`like-toggle-${session.user.id}`, 100, 60 * 60 * 1000)
    ) {
        throw new Error("Too many requests. Please try again later.");
    }

    const existingLike = await db.query.likes.findFirst({
        where: and(
            eq(likes.threadId, threadId),
            eq(likes.userId, session.user.id),
        ),
    });

    if (existingLike) {
        await db
            .delete(likes)
            .where(
                and(
                    eq(likes.threadId, threadId),
                    eq(likes.userId, session.user.id),
                ),
            );
    } else {
        await db.insert(likes).values({ threadId, userId: session.user.id });
    }

    // Revalidate routes so the changes instantly update in UI
    revalidatePath("/");
    revalidatePath("/profile/me");
}

export async function createCommentAction(threadId: string, content: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // Rate limiting: max 50 comments per hour per user
    if (
        !checkRateLimit(`comment-create-${session.user.id}`, 50, 60 * 60 * 1000)
    ) {
        throw new Error("Too many requests. Please try again later.");
    }

    // Validate and sanitize content
    const contentValidation = validateContentSafety(content);
    if (!contentValidation.isValid) {
        throw new Error(contentValidation.error);
    }

    if (!contentValidation.sanitized.trim()) {
        throw new Error("Comment cannot be empty");
    }

    // Additional length check for comments (max 500 chars)
    if (contentValidation.sanitized.length > 500) {
        throw new Error("Comment must be less than 500 characters");
    }

    await db.insert(comments).values({
        threadId,
        content: contentValidation.sanitized,
        authorId: session.user.id,
    });

    revalidatePath("/");
    revalidatePath("/profile/me");
}
