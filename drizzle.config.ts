import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./lib/env";

if (!env.DATABASE_URL)
    throw new Error("DATABASE_URL is not defined in environment variables");

export default defineConfig({
    out: "./drizzle",
    schema: "./database/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
