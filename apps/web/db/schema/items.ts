import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { worldsSchema } from "./worlds";
import { charactersSchema } from "./characters";

export const itemEquipmentTypeEnum = pgEnum("itemEquipmentType", [
  "None",
  "OnehandWeapon",
  "TwoHandWeapon",
  "BodyArmor",
  "Shield",
]);

export const itemTypeEnum = pgEnum("itemType", ["Consumable", "Equipment"]);

export const rarityEnum = pgEnum("rarity", ["Common", "Uncommon", "Rare", "Epic", "Legendary"]);

export const itemDefinitionSchema = pgTable("itemDefinitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  type: itemTypeEnum("itemType").default("Consumable").notNull(),
  equipmentType: itemEquipmentTypeEnum("equipmentType").default("None").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  rarity: rarityEnum("rarity").default("Common").notNull(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ItemDefinitionRecord = typeof itemDefinitionSchema.$inferSelect;
export type NewItemDefinitionRecord = typeof itemDefinitionSchema.$inferInsert;

export const itemsToActionsSchema = pgTable("itemsToActions", {
  itemId: uuid("itemId")
    .notNull()
    .references(() => itemDefinitionSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const itemInstanceSchema = pgTable("itemInstances", {
  id: uuid("id").defaultRandom().primaryKey(),
  characterId: uuid("characterId").references(() => charactersSchema.id),
  itemDefinitionId: uuid("itemDefinitionId")
    .references(() => itemDefinitionSchema.id)
    .notNull(),
});

export type ItemInstanceRecord = typeof itemInstanceSchema.$inferSelect;
export type NewItemInstanceRecord = typeof itemInstanceSchema.$inferInsert;
