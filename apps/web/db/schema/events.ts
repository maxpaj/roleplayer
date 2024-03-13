import {
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { campaignsSchema } from "./campaigns";
import { charactersSchema } from "./characters";

export const eventsSchema = pgTable("events", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 256 }).notNull(),
  eventData: json("eventData").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  characterId: integer("characterId").references(() => charactersSchema.id),
  campaignId: integer("campaignId")
    .references(() => campaignsSchema.id)
    .notNull(),
});

export type EventRecord = typeof eventsSchema.$inferSelect;
export type NewEventRecord = typeof eventsSchema.$inferInsert;
