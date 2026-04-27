import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { threads, user } from "@/database/schema";

export const updateProfileSchema = createInsertSchema(user, {
    bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
    name: z.string().max(50, "Name must be at most 50 characters"),
    image: z
        .union([
            z
                .file()
                .refine((file) => file.type.startsWith("image/"), {
                    message: "Only image files are allowed",
                })
                .nullable(),
            z.string().url("Must be a valid URL").nullable(),
        ])
        .optional(),
}).pick({
    name: true,
    image: true,
    bio: true,
});

export const createThreadSchema = createInsertSchema(threads, {
    content: z
        .string()
        .min(1, "Content is required")
        .max(1000, "Content too long"),
}).pick({
    content: true,
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const validIdSchema = z.string().uuid("Invalid ID format");
