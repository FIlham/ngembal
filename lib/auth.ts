import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/database";
import { uploadImage } from "./cloudinary";
import { env } from "./env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (user.image?.includes("googleusercontent")) {
                        try {
                            const up = await uploadImage(user.image);
                            user.image = up.imageUrl;
                        } catch (error) {
                            console.error(
                                "Error uploading image to Cloudinary:",
                                error,
                            );
                        }
                    }
                },
            },
        },
    },
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            enabled: true,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
        },
    },
    plugins: [nextCookies()],
});
