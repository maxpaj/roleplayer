import {
  ActionDefinition,
  Actor,
  Battle,
  CharacterResourceGeneration,
  EffectEvent,
  EquipmentSlotDefinition,
} from "../..";
import {
  CharacterResourceDefinition,
  CharacterStatType,
  Clazz,
  ElementDefinition,
  LevelProgression,
  Ruleset,
} from "../../core/ruleset/ruleset";

export class LeagueOfDungeoneersRuleset implements Ruleset {
  getCurrentActorTurn(battle: Battle): Actor {
    throw new Error("Method not implemented.");
  }

  characterHit(attacker: Actor, action: ActionDefinition, defender: Actor): boolean {
    throw new Error("Method not implemented.");
  }

  characterIsDead(actor: Actor): boolean {
    throw new Error("Method not implemented.");
  }

  roll(dice: number): number {
    throw new Error("Method not implemented.");
  }

  getLevelProgression(): LevelProgression[] {
    throw new Error("Method not implemented.");
  }

  getCharacterStatTypes(): CharacterStatType[] {
    throw new Error("Method not implemented.");
  }

  getCharacterResourceTypes(): CharacterResourceDefinition[] {
    throw new Error("Method not implemented.");
  }

  getCharacterEquipmentSlots(): EquipmentSlotDefinition[] {
    throw new Error("Method not implemented.");
  }

  getClassDefinitions(): Clazz[] {
    throw new Error("Method not implemented.");
  }

  getElementDefinitions(): ElementDefinition[] {
    throw new Error("Method not implemented.");
  }

  characterBattleActionOrder(actor: Actor): number {
    throw new Error("Method not implemented.");
  }

  characterHitDamage(source: Actor, action: ActionDefinition, target: Actor, effect: EffectEvent): number {
    throw new Error("Method not implemented.");
  }

  characterResistanceMultiplier(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }

  characterResistanceAbsolute(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }

  characterResourceGeneration(actor: Actor): CharacterResourceGeneration[] {
    throw new Error("Method not implemented.");
  }

  characterElementDamageMultiplier(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }
}
