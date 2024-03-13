import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";
import { actionsSchema } from "./actions";

export const itemTypeEnum = pgEnum("itemType", ["Consumable", "Equipment"]);
export const rarityEnum = pgEnum("rarity", [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
]);

export const itemsSchema = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  type: itemTypeEnum("itemType").default("Consumable").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  rarity: rarityEnum("rarity").default("Common").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const itemsToActionsSchema = pgTable("itemsToActions", {
  itemId: integer("itemId")
    .notNull()
    .references(() => itemsSchema.id),

  actionId: integer("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type ItemRecord = typeof itemsSchema.$inferSelect;
export type NewItemRecord = typeof itemsSchema.$inferInsert;
