import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const rulesSchema = pgTable("rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  userId: uuid("userId").references(() => usersSchema.id),
});
