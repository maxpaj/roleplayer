import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { campaignsSchema } from "./campaigns";
import { charactersSchema } from "./characters";

export const eventsSchema = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 256 }).notNull(),
  roundId: uuid("roundId"),
  eventId: uuid("eventId").unique().notNull(),
  battleId: uuid("battleId"),
  eventData: json("eventData").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  updatedUtc: timestamp("updatedUtc").defaultNow(),
  characterId: uuid("characterId").references(() => charactersSchema.id),
  campaignId: uuid("campaignId")
    .references(() => campaignsSchema.id)
    .notNull(),
});

export type EventRecord = typeof eventsSchema.$inferSelect;
export type NewEventRecord = typeof eventsSchema.$inferInsert;
