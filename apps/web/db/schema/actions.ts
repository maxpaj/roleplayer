import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";
import { effectsSchema } from "./effects";

export const actionsSchema = pgTable("actions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const actionsToEffectSchema = pgTable("actionsToEffects", {
  effectId: integer("effectId")
    .notNull()
    .references(() => effectsSchema.id),

  actionId: integer("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type ActionRecord = typeof actionsSchema.$inferSelect;
export type NewActionRecord = typeof actionsSchema.$inferInsert;
