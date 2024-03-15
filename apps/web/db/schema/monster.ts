import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { actionsSchema } from "./actions";
import { worldsSchema } from "./worlds";

export const monstersSchema = pgTable("monsters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 8192 }),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export const monstersToActionsSchema = pgTable("monsterToActions", {
  monsterId: uuid("monsterId")
    .notNull()
    .references(() => monstersSchema.id),

  actionId: uuid("actionId")
    .notNull()
    .references(() => actionsSchema.id),
});

export type MonsterRecord = typeof monstersSchema.$inferSelect;
export type NewMonsterRecord = typeof monstersSchema.$inferInsert;
