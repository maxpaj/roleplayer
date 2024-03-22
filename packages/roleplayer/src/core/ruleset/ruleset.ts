import { Id } from "../../lib/generate-id";
import { Actor } from "../actor/character";
import { Roll } from "../dice/dice";
import { ActionDefinition } from "../world/action/action";
import { EquipmentSlotDefinition } from "../world/item/item";

export enum ActionResourceType {
  Primary = "Primary",
  Secondary = "Secondary",
}

export enum Alignment {
  NeutralEvil = "NeutralEvil",
  LawfulEvil = "LawfulEvil",
  ChaoticEvil = "ChaoticEvil",
  NeutralNeutral = "NeutralNeutral",
  EvilNeutral = "EvilNeutral",
  GoodNeutral = "GoodNeutral",
  NeutralGood = "NeutralGood",
  LawfulGood = "LawfulGood",
  ChaoticGood = "ChaoticGood",
}

export type LevelProgression = {
  id: Id;
  requiredXp: number;
  unlocksLevel: number;
};

export type ClassLevelProgression = {
  unlockedAtLevel: number;
  actionDefinitionId: ActionDefinition["id"];
};

export type Race = {
  id: Id;
  name: string;
};

export type Clazz = {
  id: Id;
  name: string;
  levelProgression: ClassLevelProgression[];
};

export type CharacterResourceType = {
  id: Id;
  name: string;
  defaultMax?: number;
};

export type CharacterStatType = {
  id: Id;
  name: string;
};

/**
 * This contains rules based on the book.
 *
 * - Level progression
 * -
 *
 */
export type Ruleset = {
  levelProgression: LevelProgression[];
  characterStatTypes: CharacterStatType[];
  characterResourceTypes: CharacterResourceType[];
  characterEquipmentSlots: EquipmentSlotDefinition[];
  classDefinitions: Clazz[];
  characterHit: (attacker: Actor, defender: Actor) => boolean;
  roll: Roll;
};
