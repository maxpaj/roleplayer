import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const rulesSchema = pgTable("rules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  userId: integer("userId").references(() => usersSchema.id),
});
