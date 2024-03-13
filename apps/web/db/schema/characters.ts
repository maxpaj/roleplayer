import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";
import { worldsSchema } from "./worlds";
import { campaignsSchema } from "./campaigns";
import { actionsSchema } from "./actions";
import { itemsSchema } from "./items";

export const charactersSchema = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 8192 }),
  userId: integer("userId").references(() => usersSchema.id),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const charactersToActionsSchema = pgTable("characterToActions", {
  characterId: integer("userId")
    .notNull()
    .references(() => charactersSchema.id),

  actionId: integer("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export const charactersToItemsSchema = pgTable("characterToItems", {
  characterId: integer("userId")
    .notNull()
    .references(() => charactersSchema.id),

  itemId: integer("itemId")
    .notNull()
    .references(() => itemsSchema.id),
});

export const charactersToCampaignsSchema = pgTable("characterToCampaigns", {
  characterId: integer("userId")
    .notNull()
    .references(() => charactersSchema.id),

  campaignId: integer("campaignId")
    .notNull()
    .references(() => campaignsSchema.id),
});

export type CharacterRecord = typeof charactersSchema.$inferSelect;
export type NewCharacterRecord = typeof charactersSchema.$inferInsert;
