import {
  date,
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";
import { worldsSchema } from "./worlds";

export const charactersSchema = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdUtc: date("createdUtc").notNull(),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 8192 }),
  userId: integer("userId")
    .references(() => usersSchema.id)
    .notNull(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type CharacterRecord = typeof charactersSchema.$inferSelect;
export type NewCharacterRecord = typeof charactersSchema.$inferInsert;
