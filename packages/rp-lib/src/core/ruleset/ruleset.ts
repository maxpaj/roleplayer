import {
  LevelProgression,
  CharacterStatType,
  CharacterResourceType,
} from "../actor/character";
import { EquipmentSlotDefinition } from "../world/item/item";
import {
  DefaultCharacterResourceTypes,
  DefaultCharacterStatTypes,
  DefaultEquipmentSlotDefinitions,
  DefaultLevelProgression,
} from "../../data/data";

export class Ruleset {
  levelProgression: LevelProgression[] = DefaultLevelProgression;
  characterStatTypes: CharacterStatType[] = DefaultCharacterStatTypes;
  characterResourceTypes: CharacterResourceType[] =
    DefaultCharacterResourceTypes;
  characterEquipmentSlots: EquipmentSlotDefinition[] =
    DefaultEquipmentSlotDefinitions;

  constructor() {}
}
