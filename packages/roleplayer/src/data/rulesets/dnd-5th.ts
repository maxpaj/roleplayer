import {
  defaultRoll,
  Actor,
  D20,
  World,
  ElementDefinition,
  CharacterResourceGeneration,
  ActionDefinition,
  CharacterResourceDefinition,
  Dice,
} from "../..";
import { CharacterStatType, Clazz, LevelProgression, Ruleset } from "../../core/ruleset/ruleset";
import { EquipmentSlotDefinition, ItemEquipmentType } from "../../core/inventory/item";
import { dangerousGenerateId } from "../../lib/generate-id";

export class DnDRuleset implements Ruleset {
  roll(dice: Dice): number {
    return defaultRoll(dice);
  }

  getLevelProgression(): LevelProgression[] {
    return [
      { requiredXp: 0, id: dangerousGenerateId(), unlocksLevel: 1 },
      { requiredXp: 50, id: dangerousGenerateId(), unlocksLevel: 2 },
      { requiredXp: 100, id: dangerousGenerateId(), unlocksLevel: 3 },
      { requiredXp: 200, id: dangerousGenerateId(), unlocksLevel: 4 },
      { requiredXp: 400, id: dangerousGenerateId(), unlocksLevel: 5 },
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
    ];
  }

  getCharacterResourceTypes(): CharacterResourceDefinition[] {
    return [
      {
        id: "00000000-0000-0000-0000-000000001000" as const,
        name: "Movement speed",
        defaultMax: 35,
      },
      {
        id: "00000000-0000-0000-0000-000000001001" as const,
        name: "Health",
        defaultMax: 20,
      },
      {
        id: "00000000-0000-0000-0000-000000001001" as const,
        name: "Armor class",
        defaultMax: 10,
      },
      { id: "00000000-0000-0000-0000-000000001002" as const, name: "Primary action", defaultMax: 1 },
      { id: "00000000-0000-0000-0000-000000001003" as const, name: "Secondary action", defaultMax: 1 },
      { id: "00000000-0000-0000-0000-000000001004" as const, name: "Spell slot 1", defaultMax: 0 },
      { id: "00000000-0000-0000-0000-000000001005" as const, name: "Spell slot 2", defaultMax: 0 },
    ];
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
            actionDefinitionId: "00000000-0000-0000-0000-000000005000" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000004000" as const,
        name: "Bard",
        levelProgression: [
          {
            actionDefinitionId: "00000000-0000-0000-0000-000000005000" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000004000" as const,
        name: "Wizard",
        levelProgression: [
          {
            actionDefinitionId: "00000000-0000-0000-0000-000000005000" as const,
            unlockedAtLevel: 1,
          },
        ],
      },
    ];
  }

  getElementDefinitions(): ElementDefinition[] {
    return [];
  }

  addEquipmentSlot(equipmentSlot: { eligibleEquipmentTypes: ItemEquipmentType[]; id: string; name: string }) {
    throw new Error("Method not implemented.");
  }

  characterHitDamage(
    source: Actor,
    action: ActionDefinition,
    target: Actor,
    element: ElementDefinition,
    variableValue: Dice,
    staticValue: number
  ) {
    const targetResistance = target.getResistance(element);
    const sourceDamage = this.roll(variableValue) + staticValue;
    return sourceDamage * targetResistance;
  }

  characterHit(world: World, attacker: Actor, defender: Actor) {
    const attackerHit = attacker.stats.find((s) => s.statId === "character-stats-hit");
    if (!attackerHit) throw new Error("Character hit not found");

    const defenderArmorClass = defender.stats.find((s) => s.statId === "character-armor-class");
    if (!defenderArmorClass) throw new Error("Character hit not found");
    return defaultRoll(D20) + attackerHit.amount > defenderArmorClass.amount;
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

  characterResourceGeneration(actor: Actor): CharacterResourceGeneration[] {
    return [];
  }

  characterBattleActionOrder(actor: Actor): number {
    return this.roll(D20);
  }

  constructor(roll: (dice: Dice) => number = defaultRoll) {
    this.roll = roll;
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
