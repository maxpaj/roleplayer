import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { worldsSchema } from "./worlds";
import { charactersSchema } from "./characters";

export const itemEquipmentTypeEnum = pgEnum("itemEquipmentType", [
  "None",
  "OneHandWeapon",
  "TwoHandWeapon",
  "BodyArmor",
  "Shield",
]);

export const itemTypeEnum = pgEnum("itemType", ["Consumable", "Equipment"]);

export const rarityEnum = pgEnum("rarity", ["Common", "Uncommon", "Rare", "Epic", "Legendary"]);

export const itemDefinitionsSchema = pgTable("itemDefinitions", {
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

export type ItemDefinitionRecord = typeof itemDefinitionsSchema.$inferSelect;
export type NewItemDefinitionRecord = typeof itemDefinitionsSchema.$inferInsert;

export const itemsToActionsSchema = pgTable("itemsToActions", {
  itemId: uuid("itemId")
    .notNull()
    .references(() => itemDefinitionsSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const itemInstancesSchema = pgTable("itemInstances", {
  id: uuid("id").defaultRandom().primaryKey(),
  characterId: uuid("characterId").references(() => charactersSchema.id),
  itemDefinitionId: uuid("itemDefinitionId")
    .references(() => itemDefinitionsSchema.id)
    .notNull(),
});

export type ItemInstanceRecord = typeof itemInstancesSchema.$inferSelect;
export type NewItemInstanceRecord = typeof itemInstancesSchema.$inferInsert;
