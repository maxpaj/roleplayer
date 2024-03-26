import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { campaignsSchema } from "./campaigns";
import { itemInstanceSchema } from "./items";
import { usersSchema } from "./users";
import { worldsSchema } from "./worlds";
import { resourceTypesSchema } from "./resources";
import { classesSchema } from "./classes";

export const characterTypeEnum = pgEnum("characterType", ["Monster", "Player", "NPC"]);

export const charactersSchema = pgTable("characters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: characterTypeEnum("type").default("Player").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  userId: uuid("userId").references(() => usersSchema.id),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const charactersToActionsSchema = pgTable("characterToActions", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const charactersToItemsSchema = pgTable("characterToItems", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  itemId: uuid("itemId")
    .notNull()
    .references(() => itemInstanceSchema.id),
});

export const charactersToClassesSchema = pgTable("characterToClasses", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  classId: uuid("classId")
    .notNull()
    .references(() => classesSchema.id),

  level: integer("level").default(1).notNull(),
});

export type CharacterClassRecord = typeof charactersToClassesSchema.$inferSelect;
export type NewCharacterClassRecord = typeof charactersToClassesSchema.$inferInsert;

export const charactersToCampaignsSchema = pgTable("characterToCampaigns", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  campaignId: uuid("campaignId")
    .notNull()
    .references(() => campaignsSchema.id),
});

export const equipmentSlotSchema = pgTable("equipmentSlot", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const charactersToEquipmentSlotsSchema = pgTable("charactersToEquipmentSlots", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  equipmentSlotId: uuid("equipmentSlotId")
    .notNull()
    .references(() => equipmentSlotSchema.id),
});

export const equipmentToEquipmentSlotsSchema = pgTable("equipmentToEquipmentSlots", {
  itemId: uuid("itemId")
    .notNull()
    .references(() => itemInstanceSchema.id),

  equipmentSlotId: uuid("equipmentSlotId")
    .notNull()
    .references(() => equipmentSlotSchema.id),
});

export const charactersToResourcesSchema = pgTable("characterToResources", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  resourceTypeId: uuid("resourceTypeId")
    .notNull()
    .references(() => resourceTypesSchema.id),

  amount: integer("amount").default(0).notNull(),
  max: integer("max").default(0).notNull(),
});

export type CharacterRecord = typeof charactersSchema.$inferSelect;
export type NewCharacterRecord = typeof charactersSchema.$inferInsert;
