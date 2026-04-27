import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { threads, user } from "@/database/schema";

export const updateProfileSchema = createInsertSchema(user, {
    bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
    name: z.string().max(50, "Name must be at most 50 characters"),
    image: z
        .union([
            z.file().refine((file) => file.type.startsWith("image/"), {
                message: "Only image files are allowed",
            }),
            z.string().url("Must be a valid URL"),
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

// Enhanced password validation for better security
const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters long")
    .refine(
        (pwd) => /[A-Z]/.test(pwd),
        "Password must contain at least one uppercase letter",
    )
    .refine(
        (pwd) => /[a-z]/.test(pwd),
        "Password must contain at least one lowercase letter",
    )
    .refine(
        (pwd) => /[0-9]/.test(pwd),
        "Password must contain at least one number",
    )
    .refine(
        (pwd) => /[^A-Za-z0-9]/.test(pwd),
        "Password must contain at least one special character (!@#$%^&*)",
    )
    .refine(
        (pwd) =>
            !/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|password|admin|user|test)/i.test(
                pwd,
            ),
        "Password contains common or sequential characters",
    );

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
});

export const validIdSchema = z.string().uuid("Invalid ID format");
