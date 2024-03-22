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
} from "..";
import { CharacterStatType, Clazz, LevelProgression, Ruleset } from "../core/ruleset/ruleset";
import { EquipmentSlotDefinition, ItemEquipmentType } from "../core/world/item/item";
import { dangerousGenerateId } from "../lib/generate-id";

export class DefaultRuleSet implements Ruleset {
  roll(dice: Dice): number {
    return defaultRoll(dice);
  }

  getLevelProgression(): LevelProgression[] {
    return DefaultLevelProgression;
  }

  getCharacterStatTypes(): CharacterStatType[] {
    return DefaultCharacterStatTypes;
  }

  getCharacterResourceTypes(): CharacterResourceDefinition[] {
    return DefaultCharacterResourceTypes;
  }

  getCharacterEquipmentSlots(): EquipmentSlotDefinition[] {
    return DefaultEquipmentSlotDefinitions;
  }

  getClassDefinitions(): Clazz[] {
    return DefaultClassDefinitions;
  }

  getElementDefinitions(): ElementDefinition[] {
    return DefaultElementDefinitions;
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

  characterResourceGeneration(character: Actor): CharacterResourceGeneration[] {
    return [];
  }

  characterBattleActionOrder(actor: Actor): number {
    return this.roll(D20);
  }

  constructor(roll: (dice: Dice) => number = defaultRoll) {
    this.roll = roll;
  }
}

export const DefaultLevelProgression: LevelProgression[] = [
  { requiredXp: 0, id: dangerousGenerateId(), unlocksLevel: 1 },
  { requiredXp: 50, id: dangerousGenerateId(), unlocksLevel: 2 },
  { requiredXp: 100, id: dangerousGenerateId(), unlocksLevel: 3 },
  { requiredXp: 200, id: dangerousGenerateId(), unlocksLevel: 4 },
  { requiredXp: 400, id: dangerousGenerateId(), unlocksLevel: 5 },
];

export const DefaultEquipmentSlotDefinitions: EquipmentSlotDefinition[] = [
  {
    id: "0000000-0000-0000-0000-000000003000" as const,
    name: "Main hand",
    eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
  },
];

export const DefaultElementDefinitions: ElementDefinition[] = [];

export const DefaultClassDefinitions: Clazz[] = [
  {
    id: "0000000-0000-0000-0000-000000004000" as const,
    name: "Rogue",
    levelProgression: [
      {
        actionDefinitionId: "0000000-0000-0000-0000-000000005000" as const,
        unlockedAtLevel: 1,
      },
    ],
  },
  {
    id: "0000000-0000-0000-0000-000000004000" as const,
    name: "Bard",
    levelProgression: [
      {
        actionDefinitionId: "0000000-0000-0000-0000-000000005000" as const,
        unlockedAtLevel: 1,
      },
    ],
  },
  {
    id: "0000000-0000-0000-0000-000000004000" as const,
    name: "Wizard",
    levelProgression: [
      {
        actionDefinitionId: "0000000-0000-0000-0000-000000005000" as const,
        unlockedAtLevel: 1,
      },
    ],
  },
];

export const DefaultCharacterResourceTypes = [
  {
    id: "0000000-0000-0000-0000-000000001000" as const,
    name: "Movement speed",
    defaultMax: 35,
  },
  {
    id: "0000000-0000-0000-0000-000000001001" as const,
    name: "Health",
    defaultMax: 20,
  },
  {
    id: "0000000-0000-0000-0000-000000001001" as const,
    name: "Armor class",
    defaultMax: 10,
  },
  { id: "0000000-0000-0000-0000-000000001002" as const, name: "Primary action", defaultMax: 1 },
  { id: "0000000-0000-0000-0000-000000001003" as const, name: "Secondary action", defaultMax: 1 },
  { id: "0000000-0000-0000-0000-000000001004" as const, name: "Spell slot 1", defaultMax: 0 },
  { id: "0000000-0000-0000-0000-000000001005" as const, name: "Spell slot 2", defaultMax: 0 },
];

export const DefaultCharacterStatTypes: CharacterStatType[] = [
  {
    id: "0000000-0000-0000-0000-000000002000" as const,
    name: "Strength",
  },
  {
    id: "0000000-0000-0000-0000-000000002001" as const,
    name: "Intelligence",
  },
  {
    id: "0000000-0000-0000-0000-000000002002" as const,
    name: "Wisdom",
  },
  {
    id: "0000000-0000-0000-0000-000000002003" as const,
    name: "Charisma",
  },
  {
    id: "0000000-0000-0000-0000-000000002004" as const,
    name: "Dexterity",
  },
  {
    id: "0000000-0000-0000-0000-000000002005" as const,
    name: "Constitution",
  },
  {
    id: "0000000-0000-0000-0000-000000002006" as const,
    name: "Defense",
  },
];
