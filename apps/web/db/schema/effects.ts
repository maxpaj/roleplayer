import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const effectsSchema = pgTable("effects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});
