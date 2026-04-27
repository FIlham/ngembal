import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

if (!env.DATABASE_URL)
    throw new Error("DATABASE_URL is not defined in environment variables");

export const db = drizzle(env.DATABASE_URL, { schema });
