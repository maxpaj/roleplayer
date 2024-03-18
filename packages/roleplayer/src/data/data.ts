import { dangerousGenerateId } from "..";
import { CharacterStatType, LevelProgression } from "../core/actor/character";
import { Ruleset } from "../core/ruleset/ruleset";
import { EquipmentSlotDefinition, ItemEquipmentType } from "../core/world/item/item";

export const DefaultLevelProgression: LevelProgression[] = [
  { requiredXp: 0, id: dangerousGenerateId(), unlocksLevel: 1 },
  { requiredXp: 50, id: dangerousGenerateId(), unlocksLevel: 2 },
  { requiredXp: 100, id: dangerousGenerateId(), unlocksLevel: 3 },
  { requiredXp: 200, id: dangerousGenerateId(), unlocksLevel: 4 },
  { requiredXp: 400, id: dangerousGenerateId(), unlocksLevel: 5 },
];

export const DefaultEquipmentSlotDefinitions: EquipmentSlotDefinition[] = [
  {
    id: "0000000-0000-0000-0000-000000003000" as const,
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: "0000000-0000-0000-0000-000000001000" as const,
    name: "Movement speed",
    defaultMax: 35,
  },
  {
    id: "0000000-0000-0000-0000-000000001001" as const,
    name: "Health",
    defaultMax: 20,
  },
  { id: "0000000-0000-0000-0000-000000001002" as const, name: "Primary action", defaultMax: 1 },
  { id: "0000000-0000-0000-0000-000000001003" as const, name: "Secondary action", defaultMax: 1 },
  { id: "0000000-0000-0000-0000-000000001004" as const, name: "Spell slot 1", defaultMax: 0 },
  { id: "0000000-0000-0000-0000-000000001005" as const, name: "Spell slot 2", defaultMax: 0 },
];

export const DefaultCharacterStatTypes: CharacterStatType[] = [
  {
    id: "0000000-0000-0000-0000-000000002000" as const,
    name: "Strength",
  },
  {
    id: "0000000-0000-0000-0000-000000002001" as const,
    name: "Intelligence",
  },
  {
    id: "0000000-0000-0000-0000-000000002002" as const,
    name: "Wisdom",
  },
  {
    id: "0000000-0000-0000-0000-000000002003" as const,
    name: "Charisma",
  },
  {
    id: "0000000-0000-0000-0000-000000002004" as const,
    name: "Dexterity",
  },
  {
    id: "0000000-0000-0000-0000-000000002005" as const,
    name: "Constitution",
  },
];

export const DefaultRuleSet: Ruleset = {
  characterEquipmentSlots: DefaultEquipmentSlotDefinitions,
  characterResourceTypes: DefaultCharacterResourceTypes,
  characterStatTypes: DefaultCharacterStatTypes,
  levelProgression: DefaultLevelProgression,
};
