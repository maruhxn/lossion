import * as schema from "@/db/schema";
import dotenv from "dotenv";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

dotenv.config();

// const client = new Pool({
//   connectionString:
// process.env.NODE_ENV === "production"
//   ? process.env.MAIN_DB_URL!
//   : process.env.DEV_DB_URL!,
// });

const client = postgres(
  process.env.NODE_ENV === "production"
    ? process.env.MAIN_DB_URL!
    : process.env.DEV_DB_URL!,
  /* @ts-ignore */
  process.env.NODE_ENV === "production" && { ssl: "require" }
);

export const db: PostgresJsDatabase<typeof schema> = drizzle(client, {
  schema,
});
