import { World } from "../..";
import { Id } from "../../lib/generate-id";
import { Actor, CharacterResourceGeneration } from "../actor/character";
import { Dice } from "../dice/dice";
import { ActionDefinition } from "../action/action";
import { EquipmentSlotDefinition } from "../inventory/item";

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
 * - level progression definition (how much xp per level)
 * - stat types (STR, DEX, CON, INT, WIS, CHA, what does what?)
 * - professions (classes)
 * - character resources (health, mana, movement, etc)
 * - equipment / inventory slots
 * - elements (fire, water, earth, air, etc)
 * - battle rules, who acts first, what determines a hit or a dodge on attack
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
