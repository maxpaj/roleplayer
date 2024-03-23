import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const racesSchema = pgTable("races", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
});

export type RaceRecord = typeof racesSchema.$inferSelect;
export type NewRaceRecord = typeof racesSchema.$inferInsert;
