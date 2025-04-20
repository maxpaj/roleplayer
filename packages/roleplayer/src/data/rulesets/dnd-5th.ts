import {
  HealthResourceTypeName,
  InitiativeResourceTypeName,
  MovementSpeedResourceTypeName,
  PrimaryActionResourceTypeName,
  SecondaryActionResourceTypeName,
  type ResourceDefinition,
  type ResourceGeneration,
} from "../..";
import type { ActionDefinition } from "../../core/action/action";
import type { CharacterResourceLossEffect } from "../../core/action/effect";
import type { Actor } from "../../core/actor/character";
import type { Battle } from "../../core/battle/battle";
import { defaultRoll, type Roll } from "../../core/dice/dice";
import { ItemEquipmentType, type EquipmentSlotDefinition } from "../../core/inventory/item";
import type {
  CharacterStatType,
  Clazz,
  ElementDefinition,
  LevelProgression,
  Ruleset,
} from "../../core/ruleset/ruleset";
import { generateId } from "../../lib/generate-id";

const MovementSpeedResource = {
  id: "00000000-0000-0000-0000-000000001000" as const,
  name: MovementSpeedResourceTypeName,
  defaultMax: 35,
};

const HealthResource = {
  id: "00000000-0000-0000-0000-000000001001" as const,
  name: HealthResourceTypeName,
  defaultMax: 10,
};
const PrimaryActionResource = {
  id: "00000000-0000-0000-0000-000000001002" as const,
  name: PrimaryActionResourceTypeName,
  defaultMax: 1,
};
const SecondaryActionResource = {
  id: "00000000-0000-0000-0000-000000001003" as const,
  name: SecondaryActionResourceTypeName,
  defaultMax: 1,
};
const SpellSlot1Resource = { id: "00000000-0000-0000-0000-000000001004" as const, name: "Spell slot 1", defaultMax: 0 };
const SpellSlot2Resource = { id: "00000000-0000-0000-0000-000000001005" as const, name: "Spell slot 2", defaultMax: 0 };
const InitiativeResource = {
  id: "00000000-0000-0000-0000-000000001006" as const,
  name: InitiativeResourceTypeName,
  defaultMax: 20,
};

const ResourceTypes: ResourceDefinition[] = [
  MovementSpeedResource,
  HealthResource,
  PrimaryActionResource,
  SecondaryActionResource,
  SpellSlot1Resource,
  SpellSlot2Resource,
  InitiativeResource,
];

export class DnDRuleset implements Ruleset {
  roll: Roll;

  constructor(roll: Roll = defaultRoll) {
    this.roll = roll;
  }

  getLevelProgression(): LevelProgression[] {
    return [
      { requiredXp: 0, id: generateId(), unlocksLevel: 1 },
      { requiredXp: 50, id: generateId(), unlocksLevel: 2 },
      { requiredXp: 100, id: generateId(), unlocksLevel: 3 },
      { requiredXp: 200, id: generateId(), unlocksLevel: 4 },
      { requiredXp: 400, id: generateId(), unlocksLevel: 5 },
    ];
  }

  getCharacterStatTypes(): CharacterStatType[] {
    return [
      {
        id: "00000000-0000-0000-0000-000000002000" as const,
        name: "Strength",
      },
      {
        id: "00000000-0000-0000-0000-000000002001" as const,
        name: "Intelligence",
      },
      {
        id: "00000000-0000-0000-0000-000000002002" as const,
        name: "Wisdom",
      },
      {
        id: "00000000-0000-0000-0000-000000002003" as const,
        name: "Charisma",
      },
      {
        id: "00000000-0000-0000-0000-000000002004" as const,
        name: "Dexterity",
      },
      {
        id: "00000000-0000-0000-0000-000000002005" as const,
        name: "Constitution",
      },
      {
        id: "00000000-0000-0000-0000-000000002006" as const,
        name: "Defense",
      },
      {
        id: "00000000-0000-0000-0000-000000001001" as const,
        name: "Armor class",
      },
    ];
  }

  getCharacterResourceTypes(): ResourceDefinition[] {
    return ResourceTypes;
  }

  getCharacterEquipmentSlots(): EquipmentSlotDefinition[] {
    return [
      {
        id: "00000000-0000-0000-0000-000000003000" as const,
        name: "Main hand",
        eligibleEquipmentTypes: [ItemEquipmentType.OneHandWeapon, ItemEquipmentType.Shield],
      },
      {
        id: "00000000-0000-0000-0000-000000003001" as const,
        name: "Off hand",
        eligibleEquipmentTypes: [ItemEquipmentType.OneHandWeapon, ItemEquipmentType.Shield],
      },
      {
        id: "00000000-0000-0000-0000-000000003002" as const,
        name: "Chest",
        eligibleEquipmentTypes: [ItemEquipmentType.BodyArmor],
      },
      {
        id: "00000000-0000-0000-0000-000000003003" as const,
        name: "Head",
        eligibleEquipmentTypes: [ItemEquipmentType.BodyArmor],
      },
    ];
  }

  getClassDefinitions(): Clazz[] {
    return [
      {
        id: "00000000-0000-0000-0000-000000004000" as const,
        name: "Rogue",
        levelProgression: [
          {
            actionDefinitionId: "00000000-0000-0000-0000-000000004100" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000005000" as const,
        name: "Bard",
        levelProgression: [
          {
            actionDefinitionId: "00000000-0000-0000-0000-000000005100" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000006000" as const,
        name: "Wizard",
        levelProgression: [
          {
            actionDefinitionId: "00000000-0000-0000-0000-000000006100" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
    ];
  }

  getElementDefinitions(): ElementDefinition[] {
    return [
      {
        id: "00000000-0000-0000-0000-000000010000",
        name: "Cold",
      },
      {
        id: "00000000-0000-0000-0000-000000020000",
        name: "Physical",
      },
      {
        id: "00000000-0000-0000-0000-000000030000",
        name: "Fire",
      },
      {
        id: "00000000-0000-0000-0000-000000040000",
        name: "Radiant",
      },
      {
        id: "00000000-0000-0000-0000-000000050000",
        name: "Necrotic",
      },
      {
        id: "00000000-0000-0000-0000-000000060000",
        name: "Thunder",
      },
    ];
  }

  characterHitDamage(source: Actor, action: ActionDefinition, target: Actor, effect: CharacterResourceLossEffect) {
    const elementTypes = this.getElementDefinitions();
    const elementType = elementTypes.find((e) => e.id === effect.elementTypeId);
    if (!elementType) {
      throw new Error("Element type not found");
    }

    const sourceDamageRoll = this.roll(effect.roll);
    const sourceDamage = sourceDamageRoll * source.getDamageAmplify(elementType);
    const targetDamageReduction = target.getResistance(elementType, sourceDamage);
    const totalDamage = sourceDamage - targetDamageReduction;
    return totalDamage;
  }

  characterHit(attacker: Actor, actionDef: ActionDefinition, defender: Actor) {
    const attackerHit = attacker.stats.find((s) => s.statId === "character-stats-hit");
    if (!attackerHit) throw new Error("Character hit not found");

    const defenderArmorClass = defender.stats.find((s) => s.statId === "character-armor-class");
    if (!defenderArmorClass) throw new Error("Character hit not found");
    return defaultRoll("D20+0") + attackerHit.amount > defenderArmorClass.amount;
  }

  characterElementDamageMultiplier(actor: Actor, damageType: ElementDefinition): number {
    return 1;
  }

  characterResistanceMultiplier(actor: Actor, damageType: ElementDefinition): number {
    return 1;
  }

  characterResistanceAbsolute(actor: Actor, damageType: ElementDefinition): number {
    return 1;
  }

  characterResourceGeneration(actor: Actor): ResourceGeneration[] {
    return [
      {
        amount: 1,
        resourceTypeId: PrimaryActionResource.id,
      },
      {
        amount: 35,
        resourceTypeId: MovementSpeedResource.id,
      },
    ];
  }

  characterIsDead(actor: Actor): boolean {
    const healthResource = this.getCharacterResourceTypes().find((r) => r.name === HealthResourceTypeName)!;
    const characterHealthResource = actor.resources.find((r) => r.resourceTypeId === healthResource.id);
    return characterHealthResource!.amount <= 0;
  }

  characterBattleActionOrder(actor: Actor): number {
    return this.roll("D20+0");
  }

  getCurrentActorTurn(battle: Battle): Actor | undefined {
    const initiativeStat = this.getCharacterStatTypes().find((s) => s.name === InitiativeResource.name);
    if (!initiativeStat) {
      throw new Error("Initiative stat not found, it is necessary for battle");
    }

    const sorted = battle.actors.sort((a, b) => {
      const initiativeA = a.stats.find((s) => s.statId === initiativeStat.id);
      const initiativeB = b.stats.find((s) => s.statId === initiativeStat.id);
      return initiativeB!.amount - initiativeA!.amount;
    });

    const currentActorIndex = sorted.findIndex((a) => a.id === battle.actorToAct!.id);

    // If we are at the end of the list, return the first actor
    return sorted[currentActorIndex + 1] || sorted[0];
  }
}

export function getAbilityModifier(abilityScore: number, fallback = -1000) {
  const map: { [index: number]: number } = {
    1: -5,
    2: -4,
    3: -4,
    4: -3,
    5: -3,
    6: -2,
    7: -2,
    8: -1,
    9: -1,
    10: 0,
    11: 0,
    12: 1,
    13: 1,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 4,
    19: 4,
    20: 5,
    21: 5,
    22: 6,
    23: 6,
    24: 7,
    25: 7,
    26: 8,
    27: 8,
    28: 9,
    29: 9,
    30: 10,
  };

  const score = map[abilityScore];

  if (!score) {
    return fallback;
  }

  return score;
}
