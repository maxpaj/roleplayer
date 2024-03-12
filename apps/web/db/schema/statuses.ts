import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const statusesSchema = pgTable("statuses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: date("createdUtc").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type StatusRecord = typeof statusesSchema.$inferSelect;
export type NewStatusRecord = typeof statusesSchema.$inferInsert;
