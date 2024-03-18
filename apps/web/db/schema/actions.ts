import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { effectsSchema } from "./effects";
import { worldsSchema } from "./worlds";

export const actionsSchema = pgTable("actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const actionsToEffectSchema = pgTable("actionsToEffects", {
  effectId: uuid("effectId")
    .notNull()
    .references(() => effectsSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type ActionRecord = typeof actionsSchema.$inferSelect;
export type NewActionRecord = typeof actionsSchema.$inferInsert;
