import { EquipmentSlotDefinition, Actor, World, ActionDefinition, CharacterResourceGeneration } from "../..";
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
  characterBattleActionOrder(actor: Actor): number {
    throw new Error("Method not implemented.");
  }
  characterHit(world: World, attacker: Actor, defender: Actor): boolean {
    throw new Error("Method not implemented.");
  }
  characterHitDamage(
    source: Actor,
    action: ActionDefinition,
    target: Actor,
    element: ElementDefinition,
    variableValue: number,
    staticValue: number
  ): number {
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
