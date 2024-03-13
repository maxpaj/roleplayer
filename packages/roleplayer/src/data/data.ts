import { CharacterStatType, LevelProgression } from "../core/actor/character";
import { Ruleset } from "../core/ruleset/ruleset";
import {
  EquipmentSlotDefinition,
  ItemEquipmentType,
} from "../core/world/item/item";

export const DefaultLevelProgression: LevelProgression[] = [
  0, 50, 100, 200, 400,
];

export const DefaultEquipmentSlotDefinitions: EquipmentSlotDefinition[] = [
  {
    id: 0,
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: 0,
    name: "Movement speed",
    defaultMax: 35,
  },
];

export const DefaultCharacterStatTypes: CharacterStatType[] = [
  {
    id: 0,
    name: "Strength",
  },
  {
    id: 1,
    name: "Intelligence",
  },
  {
    id: 2,
    name: "Wisdom",
  },
  {
    id: 3,
    name: "Charisma",
  },
  {
    id: 4,
    name: "Dexterity",
  },
  {
    id: 5,
    name: "Constitution",
  },
];

export const DefaultRuleSet: Ruleset = {
  characterEquipmentSlots: DefaultEquipmentSlotDefinitions,
  characterResourceTypes: DefaultCharacterResourceTypes,
  characterStatTypes: DefaultCharacterStatTypes,
  levelProgression: DefaultLevelProgression,
};
