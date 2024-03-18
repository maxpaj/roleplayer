import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { worldsSchema } from "./worlds";
import { resourceTypeEnum } from "./resources";

export const challengeRatingEnum = pgEnum("challengeRating", ["1/8", "1/4", "1/2", "1", "2"]);

export const monstersSchema = pgTable("monsters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  challengeRating: challengeRatingEnum("challengeRating").default("1").notNull(),
  baseArmorClass: integer("baseArmorClass").default(0).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const monstersToActionsSchema = pgTable("monsterToActions", {
  monsterId: uuid("monsterId")
    .notNull()
    .references(() => monstersSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const monstersToResourcesSchema = pgTable("monsterToResources", {
  monsterId: uuid("monsterId")
    .notNull()
    .references(() => monstersSchema.id),
  resourceType: resourceTypeEnum("resourceType"),
  max: integer("max").default(0).notNull(),
});

export type MonsterRecord = typeof monstersSchema.$inferSelect;
export type NewMonsterRecord = typeof monstersSchema.$inferInsert;
