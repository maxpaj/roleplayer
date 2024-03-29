import { json, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const effectTypeEnum = pgEnum("effectType", [
  "CharacterSpawned",
  "CharacterNameSet",
  "CharacterResourceMaxSet",
  "CharacterResourceGain",
  "CharacterResourceLoss",
  "CharacterStatChange",
  "CharacterExperienceChanged",
  "CharacterExperienceSet",
  "CharacterDespawn",
  "CharacterMovement",
  "CharacterEndRound",
  "CharacterActionGain",
  "CharacterEquipmentSlotGain",
  "CharacterInventoryItemGain",
  "CharacterInventoryItemLoss",
  "CharacterInventoryItemEquip",
  "CharacterInventoryItemUnEquip",
  "CharacterPositionSet",
  "CharacterStatusGain",
  "CharacterAttackAttackerHit",
  "CharacterAttackAttackerMiss",
  "CharacterAttackDefenderHit",
  "CharacterAttackDefenderDodge",
  "CharacterAttackDefenderParry",
]);

export const effectsSchema = pgTable("effects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: effectTypeEnum("type").notNull(),
  description: varchar("description", { length: 8192 }).default("").notNull(),
  parameters: json("parameters").notNull(),
  createdUtc: timestamp("createdUtc").defaultNow(),
  worldId: uuid("worldId")
    .references(() => worldsSchema.id)
    .notNull(),
});

export type EffectRecord = typeof effectsSchema.$inferSelect;
export type NewEffectRecord = typeof effectsSchema.$inferInsert;
