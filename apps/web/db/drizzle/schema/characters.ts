import {
  date,
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const charactersSchema = pgTable(
  "characters",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdUtc: date("createdUtc").notNull(),
    imageUrl: varchar("imageUrl", { length: 2048 }),
    description: varchar("description", { length: 4096 }),
    userId: integer("userId")
      .references(() => usersSchema.id)
      .notNull(),
  },
  (characters) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(characters.name),
    };
  }
);
