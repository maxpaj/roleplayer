import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const friendInvitesSchema = pgTable("friendInvites", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  acceptedUtc: timestamp("acceptedUtc"),
  expiredUtc: timestamp("expiredUtc"),
  userId: integer("userId")
    .references(() => usersSchema.id)
    .notNull(),
});

export type FriendInviteRecord = typeof friendInvitesSchema.$inferSelect;
export type NewFriendInviteRecord = typeof friendInvitesSchema.$inferInsert;
