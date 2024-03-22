import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const rulesSchema = pgTable("rulesets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  userId: uuid("userId").references(() => usersSchema.id),
});

export type RulesRecord = typeof rulesSchema.$inferSelect;
export type NewRulesRecord = typeof rulesSchema.$inferInsert;
