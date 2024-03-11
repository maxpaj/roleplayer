import {
  serial,
  varchar,
  boolean,
  pgTable,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";
import { usersSchema } from "./users";

export const campaignsSchema = pgTable("campaign", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isDemo: boolean("isDemo").notNull(),
  createdUtc: date("createdUtc"),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 8192 }),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
  userId: integer("userId")
    .references(() => usersSchema.id)
    .notNull(),
});

export type CampaignRecord = typeof campaignsSchema.$inferSelect;
export type NewCampaignRecord = typeof campaignsSchema.$inferInsert;
