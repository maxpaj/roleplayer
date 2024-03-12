import {
  date,
  integer,
  json,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { campaignsSchema } from "./campaigns";

export const eventsSchema = pgTable("events", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 256 }).notNull(),
  eventData: json("eventData").notNull(),
  createdUtc: date("createdUtc").notNull(),
  campaignId: integer("campaignId")
    .references(() => campaignsSchema.id)
    .notNull(),
});

export type EventRecord = typeof eventsSchema.$inferSelect;
export type NewEventRecord = typeof eventsSchema.$inferInsert;
