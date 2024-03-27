import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { effectsSchema } from "./effects";
import { worldsSchema } from "./worlds";
import { resourceTypesSchema } from "./resources";

export const actionsSchema = pgTable("actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  createdUtc: timestamp("createdUtc").defaultNow(),
  rangeDistanceUnits: integer("rangeDistanceUnits").default(0).notNull(),
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

  resourceType: uuid("resourceTypeId")
    .notNull()
    .references(() => resourceTypesSchema.id),
});

export const actionsToEffectSchema = pgTable("actionsToEffects", {
  effectId: uuid("effectId")
    .notNull()
    .references(() => effectsSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type TargetTypeEnum = typeof targetTypeEnum;

export type RequiredResourceRecord = typeof actionsToResourceRequirementSchema.$inferSelect;
export type NewRequiredResourceRecord = typeof actionsToResourceRequirementSchema.$inferInsert;

export type ActionRecord = typeof actionsSchema.$inferSelect;
export type NewActionRecord = typeof actionsSchema.$inferInsert;
