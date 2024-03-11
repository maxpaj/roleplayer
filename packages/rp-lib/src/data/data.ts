import { CharacterStatType, LevelProgression } from "../core/actor/character";
import { Ruleset } from "../core/ruleset/ruleset";
import {
  EquipmentSlotDefinition,
  ItemEquipmentType,
} from "../core/world/item/item";
import { dangerousGenerateId } from "../lib/generate-id";

export const DefaultLevelProgression: LevelProgression[] = [
  0, 50, 100, 200, 400,
];

export const DefaultEquipmentSlotDefinitions: EquipmentSlotDefinition[] = [
  {
    id: dangerousGenerateId(),
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: dangerousGenerateId(),
    name: "Movement speed",
    defaultMax: 35,
  },
];

export const DefaultCharacterStatTypes: CharacterStatType[] = [
  {
    id: dangerousGenerateId(),
    name: "Strength",
  },
  {
    id: dangerousGenerateId(),
    name: "Intelligence",
  },
  {
    id: dangerousGenerateId(),
    name: "Wisdom",
  },
  {
    id: dangerousGenerateId(),
    name: "Charisma",
  },
  {
    id: dangerousGenerateId(),
    name: "Dexterity",
  },
  {
    id: dangerousGenerateId(),
    name: "Constitution",
  },
];

export const DefaultRuleSet: Ruleset = {
  characterEquipmentSlots: DefaultEquipmentSlotDefinitions,
  characterResourceTypes: DefaultCharacterResourceTypes,
  characterStatTypes: DefaultCharacterStatTypes,
  levelProgression: DefaultLevelProgression,
};
