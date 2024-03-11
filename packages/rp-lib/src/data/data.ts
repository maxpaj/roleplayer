import { CharacterStatType } from "../core/actor/character";
import { ItemEquipmentType } from "../core/world/item/item";
import { dangerousGenerateId } from "../lib/generate-id";

export const DefaultLevelProgression = [0, 50, 100, 200, 400];

export const DefaultEquipmentSlotDefinitions = [
  {
    id: dangerousGenerateId(),
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: dangerousGenerateId(),
    name: "Movement Speed",
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
