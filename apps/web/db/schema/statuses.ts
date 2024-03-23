import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";
import { effectsSchema } from "./effects";

export const durationTypeEnum = pgEnum("targetType", ["Forever", "UntilLongRest", "UntilShortRest", "NumberOfRounds"]);

export const statusesSchema = pgTable("statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  durationType: durationTypeEnum("durationType").notNull().default("NumberOfRounds"),
  duration: integer("duration").notNull().default(0),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const statusesToEffectsSchema = pgTable("stausesToEffects", {
  effectId: uuid("effectId")
    .notNull()
    .references(() => effectsSchema.id),

  statusId: uuid("actionId")
    .notNull()
    .references(() => statusesSchema.id),
});

export type StatusRecord = typeof statusesSchema.$inferSelect;
export type NewStatusRecord = typeof statusesSchema.$inferInsert;
