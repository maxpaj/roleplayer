import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const effectTypeEnum = pgEnum("effectType", ["StatusGain", "StatusLoss", "ResourceLoss", "ResourceGain"]);

export const elementTypeEnum = pgEnum("elementType", [
  "Slashing",
  "Piercing",
  "Bludgeoning",
  "Poison",
  "Acid",
  "Fire",
  "Cold",
  "Radiant",
  "Necrotic",
  "Lightning",
  "Thunder",
  "Force",
  "Psychic",
]);

export const effectsSchema = pgTable("effects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: effectTypeEnum("type").notNull(),
  element: elementTypeEnum("element").notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type EffectRecord = typeof effectsSchema.$inferSelect;
export type NewEffectRecord = typeof effectsSchema.$inferInsert;
