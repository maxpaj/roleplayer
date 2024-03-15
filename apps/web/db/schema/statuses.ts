import {
  pgTable,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const statusesSchema = pgTable("statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type StatusRecord = typeof statusesSchema.$inferSelect;
export type NewStatusRecord = typeof statusesSchema.$inferInsert;
