"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { threads } from "@/database/schema";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateContentSafety } from "@/lib/sanitizer";
import { createThreadSchema } from "../validations";

export async function createThreadAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Rate limiting: max 20 threads per hour per user
    if (
        !checkRateLimit(`thread-create-${session.user.id}`, 20, 60 * 60 * 1000)
    ) {
        return { error: "Too many requests. Please try again later." };
    }

    const content = formData.get("content") as string;

    // Validate and sanitize content
    const contentValidation = validateContentSafety(content);
    if (!contentValidation.isValid) {
        return { error: contentValidation.error };
    }

    const validated = createThreadSchema.safeParse({
        content: contentValidation.sanitized,
    });

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.content?.[0] };
    }

    try {
        await db.insert(threads).values({
            content: validated.data.content,
            authorId: session.user.id,
        });
    } catch (error) {
        console.error("Failed to create thread:", error);
        return { error: "Failed to create thread" };
    }

    revalidatePath("/");
    revalidatePath("/profile/me");
    redirect("/");
}

export async function updateThreadAction(threadId: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Rate limiting: max 30 updates per hour per user
    if (
        !checkRateLimit(`thread-update-${session.user.id}`, 30, 60 * 60 * 1000)
    ) {
        return { error: "Too many requests. Please try again later." };
    }

    const content = formData.get("content") as string;

    // Validate and sanitize content
    const contentValidation = validateContentSafety(content);
    if (!contentValidation.isValid) {
        return { error: contentValidation.error };
    }

    const validated = createThreadSchema.safeParse({
        content: contentValidation.sanitized,
    });

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.content?.[0] };
    }

    try {
        await db
            .update(threads)
            .set({ content: validated.data.content })
            .where(
                and(
                    eq(threads.id, threadId),
                    eq(threads.authorId, session.user.id),
                ),
            );
    } catch (error) {
        console.error("Failed to update thread:", error);
        return { error: "Failed to update thread" };
    }

    revalidatePath("/");
    revalidatePath("/profile/me");
}

export async function deleteThreadAction(threadId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Rate limiting: max 50 deletions per hour per user
    if (
        !checkRateLimit(`thread-delete-${session.user.id}`, 50, 60 * 60 * 1000)
    ) {
        return { error: "Too many requests. Please try again later." };
    }

    try {
        await db
            .delete(threads)
            .where(
                and(
                    eq(threads.id, threadId),
                    eq(threads.authorId, session.user.id),
                ),
            );
    } catch (error) {
        console.error("Failed to delete thread:", error);
        return { error: "Failed to delete thread" };
    }

    revalidatePath("/");
    revalidatePath("/profile/me");
}
