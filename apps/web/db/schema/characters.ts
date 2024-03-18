import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { campaignsSchema } from "./campaigns";
import { itemsSchema } from "./items";
import { usersSchema } from "./users";
import { worldsSchema } from "./worlds";

export const charactersSchema = pgTable("characters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
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
    .references(() => itemsSchema.id),
});

export const charactersToCampaignsSchema = pgTable("characterToCampaigns", {
  characterId: uuid("characterId")
    .notNull()
    .references(() => charactersSchema.id),

  campaignId: uuid("campaignId")
    .notNull()
    .references(() => campaignsSchema.id),
});

export type CharacterRecord = typeof charactersSchema.$inferSelect;
export type NewCharacterRecord = typeof charactersSchema.$inferInsert;
