import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const classesSchema = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type ClazzRecord = typeof classesSchema.$inferSelect;
export type NewClazzRecord = typeof classesSchema.$inferInsert;
