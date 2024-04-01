import { ActionDefinition, Actor, CharacterResourceGeneration, EquipmentSlotDefinition, World } from "../..";
import {
  CharacterResourceDefinition,
  CharacterStatType,
  Clazz,
  ElementDefinition,
  LevelProgression,
  Ruleset,
} from "../../core/ruleset/ruleset";

export class PathfinderRuleset implements Ruleset {
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
  getCharacterBattleActionOrder(actor: Actor): number {
    throw new Error("Method not implemented.");
  }
  onCharacterHit(world: World, attacker: Actor, defender: Actor): boolean {
    throw new Error("Method not implemented.");
  }
  getCharacterHitDamage(
    source: Actor,
    action: ActionDefinition,
    target: Actor,
    element: ElementDefinition,
    variableValue: number,
    staticValue: number
  ): number {
    throw new Error("Method not implemented.");
  }
  getCharacterResistanceMultiplier(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }
  getCharacterResistanceAbsolute(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }
  getCharacterResourceGeneration(actor: Actor): CharacterResourceGeneration[] {
    throw new Error("Method not implemented.");
  }
  getCharacterElementDamageMultiplier(actor: Actor, damageType: ElementDefinition): number {
    throw new Error("Method not implemented.");
  }
}
