"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type z from "zod";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";
import { uploadImage } from "../cloudinary";
import { updateProfileSchema } from "../validations";

export type UpdateProfileState = {
    error?: string | null;
    success?: boolean;
};

export async function updateProfileAction(
    _prevState: UpdateProfileState | null,
    values: z.infer<typeof updateProfileSchema>,
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Rate limiting: max 10 profile updates per hour per user
    if (
        !checkRateLimit(`profile-update-${session.user.id}`, 10, 60 * 60 * 1000)
    ) {
        return { error: "Too many profile updates. Please try again later." };
    }

    const validated = updateProfileSchema.safeParse(values);

    if (!validated.success) {
        return { error: "Invalid input" };
    }

    const updates: Record<string, unknown> = {};

    // Update name if provided
    if (validated.data.name !== undefined && validated.data.name !== "") {
        updates.name = validated.data.name;
    }

    // Update image if provided
    if (validated.data.image !== undefined && validated.data.image !== null) {
        const uploadResult = await uploadImage(validated.data.image, true);
        if (!uploadResult.success) {
            return {
                error:
                    uploadResult.error ||
                    "Failed to upload image. Please try again.",
            };
        }
        updates.image = uploadResult.imageUrl;
    }

    // Update bio if provided
    if (validated.data.bio !== undefined) {
        updates.bio = validated.data.bio || null;
    }

    if (Object.keys(updates).length === 0) {
        return { success: true };
    }

    try {
        await auth.api.updateUser({
            body: updates,
            headers: await headers(),
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Failed to update profile:", error);
        }
        return { error: "Failed to update profile" };
    }

    revalidatePath("/profile/me");
    revalidatePath("/profile/update");
    redirect("/profile/me");
}
