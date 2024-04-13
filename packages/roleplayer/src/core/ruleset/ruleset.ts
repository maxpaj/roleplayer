import type { Id } from "../../lib/generate-id";
import type { ActionDefinition } from "../action/action";
import { CharacterResourceLossEffect } from "../action/effect";
import type { Actor, CharacterResourceGeneration } from "../actor/character";
import { Battle } from "../battle/battle";
import type { EquipmentSlotDefinition } from "../inventory/item";

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
 * A ruleset should implement rules from a table top game system.
 *
 * - Level progression definition (how much xp per level, what is unlocked at each level)
 * - Stat types (str, dex, con, int, wis, cha -- what does what?)
 * - Professions (classes)
 * - Character resources (health, mana, movement, etc)
 * - Equipment / inventory slots (main hand, off hand, head, chest, etc)
 * - Effects (what happens when a character gets hit, what happens when a character hits)
 * - Elements (fire, water, earth, air, psychic, physical, etc)
 * - Battle rules, who acts first, what determines a hit or a dodge on attack
 *
 */
export interface Ruleset {
  getLevelProgression(): LevelProgression[];
  getCharacterStatTypes(): CharacterStatType[];
  getCharacterResourceTypes(): CharacterResourceDefinition[];
  getCharacterEquipmentSlots(): EquipmentSlotDefinition[];
  getClassDefinitions(): Clazz[];
  getElementDefinitions(): ElementDefinition[];
  getCurrentActorTurn(battle: Battle): Actor | undefined;

  characterBattleActionOrder(actor: Actor): number;
  characterHit(attacker: Actor, action: ActionDefinition, defender: Actor): boolean;
  characterHitDamage(
    source: Actor,
    action: ActionDefinition,
    target: Actor,
    effect: CharacterResourceLossEffect
  ): number;
  characterResistanceMultiplier(actor: Actor, damageType: ElementDefinition): number;
  characterResistanceAbsolute(actor: Actor, damageType: ElementDefinition): number;
  characterResourceGeneration(actor: Actor): CharacterResourceGeneration[];
  characterElementDamageMultiplier(actor: Actor, damageType: ElementDefinition): number;
  characterIsDead(actor: Actor): boolean;
}
