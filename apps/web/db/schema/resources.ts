import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const resourcesTypeSchema = pgTable("resourceTypes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  defaultMax: integer("defaultMax").default(0).notNull(),
});

export type ResourceRecord = typeof resourcesTypeSchema.$inferSelect;
export type NewResourceRecord = typeof resourcesTypeSchema.$inferInsert;
