import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { worldsSchema } from "./worlds";

export const itemTypeEnum = pgEnum("itemType", ["Consumable", "Equipment"]);
export const rarityEnum = pgEnum("rarity", ["Common", "Uncommon", "Rare", "Epic", "Legendary"]);

export const itemsSchema = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  type: itemTypeEnum("itemType").default("Consumable").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  rarity: rarityEnum("rarity").default("Common").notNull(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const itemsToActionsSchema = pgTable("itemsToActions", {
  itemId: uuid("itemId")
    .notNull()
    .references(() => itemsSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type ItemRecord = typeof itemsSchema.$inferSelect;
export type NewItemRecord = typeof itemsSchema.$inferInsert;
