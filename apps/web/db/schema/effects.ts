import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const effectsSchema = pgTable("effects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type EffectRecord = typeof effectsSchema.$inferSelect;
export type NewEffectRecord = typeof effectsSchema.$inferInsert;
