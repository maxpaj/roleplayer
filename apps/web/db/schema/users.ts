import {
  date,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable(
  "user",
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

export type UserRecord = typeof usersSchema.$inferSelect;
export type NewUserRecord = typeof usersSchema.$inferInsert;
