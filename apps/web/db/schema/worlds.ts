import {
  boolean,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";
import { rulesSchema } from "./rules";

export const worldsSchema = pgTable("worlds", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  isTemplate: boolean("isTemplate").default(false),
  isPublic: boolean("isPublic").default(false),
  rulesetId: integer("rulesetId")
    .references(() => rulesSchema.id)
    .default(1),
  userId: integer("userId").references(() => usersSchema.id),
});

export type WorldRecord = typeof worldsSchema.$inferSelect;
export type NewWorldRecord = typeof worldsSchema.$inferInsert;
