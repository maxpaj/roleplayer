import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const worldsSchema = pgTable("worlds", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  userId: integer("userId").references(() => usersSchema.id),
});
