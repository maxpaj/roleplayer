import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { rulesSchema } from "./rules";
import { usersSchema } from "./users";

export const worldsSchema = pgTable("worlds", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  isTemplate: boolean("isTemplate").default(false),
  isPublic: boolean("isPublic").default(false),
  rulesetId: uuid("rulesetId").references(() => rulesSchema.id),
  userId: uuid("userId").references(() => usersSchema.id),
});

export type WorldRecord = typeof worldsSchema.$inferSelect;
export type NewWorldRecord = typeof worldsSchema.$inferInsert;
