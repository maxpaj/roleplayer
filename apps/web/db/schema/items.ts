import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const itemsSchema = pgTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: date("createdUtc").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ItemRecord = typeof itemsSchema.$inferSelect;
export type NewItemRecord = typeof itemsSchema.$inferInsert;
