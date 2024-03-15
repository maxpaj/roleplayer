import { boolean, date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";
import { worldsSchema } from "./worlds";

export const campaignsSchema = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isDemo: boolean("isDemo").notNull(),
  createdUtc: date("createdUtc"),
  updatedUtc: date("updatedUtc"),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 8192 }),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
  userId: uuid("userId")
    .references(() => usersSchema.id)
    .notNull(),
});

export type CampaignRecord = typeof campaignsSchema.$inferSelect;
export type NewCampaignRecord = typeof campaignsSchema.$inferInsert;
