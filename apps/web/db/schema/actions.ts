import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const actionsSchema = pgTable("action", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: date("createdUtc").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ActionRecord = typeof actionsSchema.$inferSelect;
export type NewActionRecord = typeof actionsSchema.$inferInsert;
