import { CharacterStatType, LevelProgression } from "../core/actor/character";
import { Ruleset } from "../core/ruleset/ruleset";
import { EquipmentSlotDefinition, ItemEquipmentType } from "../core/world/item/item";

export const DefaultLevelProgression: LevelProgression[] = [0, 50, 100, 200, 400];

export const DefaultEquipmentSlotDefinitions: EquipmentSlotDefinition[] = [
  {
    id: "0000000-0000-0000-0000-000000000000" as const,
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
