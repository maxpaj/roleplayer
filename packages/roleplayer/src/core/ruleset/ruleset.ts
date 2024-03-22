import { World } from "../..";
import { Id } from "../../lib/generate-id";
import { Actor, CharacterResourceGeneration } from "../actor/character";
import { Dice } from "../dice/dice";
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

export type ElementDefinition = {
  id: Id;
  name: string;
};

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

export type CharacterResourceDefinition = {
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
export interface Ruleset {
  roll(roll: Dice): number;

  getLevelProgression(): LevelProgression[];
  getCharacterStatTypes(): CharacterStatType[];
  getCharacterResourceTypes(): CharacterResourceDefinition[];
  getCharacterEquipmentSlots(): EquipmentSlotDefinition[];
  getClassDefinitions(): Clazz[];
  getElementDefinitions(): ElementDefinition[];

  characterBattleActionOrder(actor: Actor): number;
  characterHit(world: World, attacker: Actor, defender: Actor): boolean;
  characterHitDamage(
    source: Actor,
    action: ActionDefinition,
    target: Actor,
    element: ElementDefinition,
    variableValue: Dice,
    staticValue: number
  ): number;
  characterResistanceMultiplier(actor: Actor, damageType: ElementDefinition): number;
  characterResistanceAbsolute(actor: Actor, damageType: ElementDefinition): number;
  characterResourceGeneration(character: Actor): CharacterResourceGeneration[];
  characterElementDamageMultiplier(actor: Actor, damageType: ElementDefinition): number;
}
