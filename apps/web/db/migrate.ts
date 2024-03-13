import { sql } from "@vercel/postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { db } from ".";

await migrate(db, { migrationsFolder: "./migrations" });

await sql.end();
