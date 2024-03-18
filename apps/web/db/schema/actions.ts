import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { effectsSchema } from "./effects";
import { worldsSchema } from "./worlds";
import { resourceTypeEnum } from "./resources";

export const actionsSchema = pgTable("actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  rangeDistanceMeters: integer("rangeDistanceMeters").default(0).notNull(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const targetTypeEnum = pgEnum("targetType", ["Self", "Character", "Friendly", "Hostile", "Environment"]);

export const actionsToTargetSchema = pgTable("actionsToTargets", {
  targetType: targetTypeEnum("targetType"),
  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const actionsToResourceRequirementSchema = pgTable("actionsToResourceRequirement", {
  amount: integer("amount").notNull().default(0),
  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
  resourceType: resourceTypeEnum("resourceType"),
});

export const actionsToEffectSchema = pgTable("actionsToEffects", {
  effectId: uuid("effectId")
    .notNull()
    .references(() => effectsSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type RequiredResourceRecord = typeof actionsToResourceRequirementSchema.$inferSelect;
export type NewRequiredResourceRecord = typeof actionsToResourceRequirementSchema.$inferInsert;

export type ActionRecord = typeof actionsSchema.$inferSelect;
export type NewActionRecord = typeof actionsSchema.$inferInsert;
