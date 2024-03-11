import {
  date,
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";
import { campaignsSchema } from "./campaigns";

export const charactersSchema = pgTable(
  "character",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdUtc: date("createdUtc").notNull(),
    imageUrl: varchar("imageUrl", { length: 2048 }),
    description: varchar("description", { length: 8192 }),
    userId: integer("userId")
      .references(() => usersSchema.id)
      .notNull(),
    campaignId: integer("campaignId")
      .references(() => campaignsSchema.id)
      .notNull(),
  },
  (characters) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(characters.name),
    };
  }
);

export type CharacterRecord = typeof charactersSchema.$inferSelect;
export type NewCharacterRecord = typeof charactersSchema.$inferInsert;
