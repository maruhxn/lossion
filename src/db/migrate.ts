import "dotenv/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const client = postgres(process.env.DEV_DB_URL!, { max: 1 });

export const db: PostgresJsDatabase = drizzle(client);

const main = async () => {
  try {
    console.log("MIGRATING...⏱️");
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("MIGRATE COMPLETE!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

main();
