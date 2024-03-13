import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";
import { actionsSchema } from "./actions";

export const monstersSchema = pgTable("monsters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: integer("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const monstersToActionsSchema = pgTable("monsterToActions", {
  monsterId: integer("monsterId")
    .notNull()
    .references(() => monstersSchema.id),

  actionId: integer("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type MonsterRecord = typeof monstersSchema.$inferSelect;
export type NewMonsterRecord = typeof monstersSchema.$inferInsert;
