import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./web/db/drizzle/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.POSTGRES_URL || "unknown host",
    user: process.env.POSTGRES_USER || "unknown user",
    password: process.env.POSTGRES_PASSWORD || "unknown password",
    database: process.env.POSTGRES_DATABASE || "unknown database",
  },
} satisfies Config;
