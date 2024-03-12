import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const itemTypeEnum = pgEnum("itemType", ["Consumable", "Equipment"]);

export const itemsSchema = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  type: itemTypeEnum("itemType").notNull(),
  createdUtc: date("createdUtc").notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ItemRecord = typeof itemsSchema.$inferSelect;
export type NewItemRecord = typeof itemsSchema.$inferInsert;
