import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const classessSchema = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: date("createdUtc").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ClazzRecord = typeof classessSchema.$inferSelect;
export type NewClazzRecord = typeof classessSchema.$inferInsert;
