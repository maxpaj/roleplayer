import { CharacterStatType } from "../core/character/character";
import { ItemEquipmentType } from "../core/item/item";
import { generateId } from "../lib/generate-id";

export const DefaultLevelProgression = [0, 50, 100, 200, 400];

export const DefaultEquipmentSlotDefinitions = [
  {
    id: generateId(),
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: generateId(),
    name: "Movement Speed",
    defaultMax: 35,
  },
];

export const DefaultCharacterStatTypes: CharacterStatType[] = [
  {
    id: generateId(),
    name: "Strength",
  },
  {
    id: generateId(),
    name: "Intelligence",
  },
  {
    id: generateId(),
    name: "Wisdom",
  },
  {
    id: generateId(),
    name: "Charisma",
  },
  {
    id: generateId(),
    name: "Dexterity",
  },
  {
    id: generateId(),
    name: "Constitution",
  },
];
