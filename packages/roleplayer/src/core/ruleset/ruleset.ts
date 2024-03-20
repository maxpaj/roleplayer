import {
  DefaultCharacterResourceTypes,
  DefaultCharacterStatTypes,
  DefaultEquipmentSlotDefinitions,
  DefaultLevelProgression,
} from "../../data/data";
import { CharacterResourceType, CharacterStatType, LevelProgression } from "../actor/character";
import { EquipmentSlotDefinition } from "../world/item/item";

export class Ruleset {
  levelProgression: LevelProgression[] = DefaultLevelProgression;
  characterStatTypes: CharacterStatType[] = DefaultCharacterStatTypes;
  characterResourceTypes: CharacterResourceType[] = DefaultCharacterResourceTypes;
  characterEquipmentSlots: EquipmentSlotDefinition[] = DefaultEquipmentSlotDefinitions;
}
