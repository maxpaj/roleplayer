import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const usersSchema = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdUtc: timestamp("createdUtc").defaultNow(),
  },
  (users) => {
    return {
      nameIndex: uniqueIndex("user_name_idx").on(users.name),
    };
  }
);

export type UserRecord = typeof usersSchema.$inferSelect;
export type NewUserRecord = typeof usersSchema.$inferInsert;
