import {
  date,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdUtc: date("createdUtc").notNull(),
  },
  (users) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(users.name),
    };
  }
);
