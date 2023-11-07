import { CampaignEvent } from "../campaign/campaign";
import { D6 } from "../dice/dice";
import { EffectType, ElementType } from "../interaction/effect";
import { Id, generateId } from "../id";
import {
  Interaction,
  InteractionType,
  TargetType,
} from "../interaction/interaction";
import { Item, ItemSlot, ItemType } from "../item/item";
import { Status } from "../interaction/status";

export type CharacterAction = {
  characterId: string;
  action: Action;
};

export enum ActionType {
  Attack = "attack",
  Sprint = "sprint",
  Jump = "jump",
  Cantrip = "cantrip",
  Spell = "spell",
  Item = "item",
  Equipment = "equipment",
  None = "none",
}

export type Action = {};

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

export enum Race {
  Dragonborne = "Dragonborne",
  Duergar = "Duergar",
  Dwarf = "Dwarf",
  Elf = "Elf",
  Gnome = "Gnome",
  Githyanki = "Githyanki",
  Goblin = "Goblin",
  HalfElf = "HalfElf",
  Halfling = "Halfling",
  HalfOrc = "HalfOrc",
  Human = "Human",
  Kobold = "Kobold",
  Orc = "Orc",
  Tiefling = "Tiefling",
}

export enum Clazz {
  Barbarian = "Barbarian",
  Bard = "Bard",
  Cleric = "Cleric",
  Druid = "Druid",
  Fighter = "Fighter",
  Monk = "Monk",
  Paladin = "Paladin",
  Ranger = "Ranger",
  Rogue = "Rogue",
  Sorcerer = "Sorcerer",
  Warlock = "Warlock",
  Wizard = "Wizard",
}

export type Spell = {
  name: string;
  level: number;
};

export type SpellSlot = {
  level: number;
  used: boolean;
};

export type Cantrip = {};

export type CharacterClass = {
  level: number;
  clazz: Clazz;
};

export type Character = {
  id: Id;
  party: Id;
  isPlayerControlled: boolean;

  name: string;
  playerName: string;
  imageUrl: string;

  background: string;
  faction: string;
  race: Race;
  alignment: Alignment;
  xp: number;
  maximumHealth: number;
  currentHealth: number;
  temporaryHealth: number;

  baseSpeed: number;
  baseArmorClass: number;
  baseStrength: number;
  baseDexterity: number;
  baseConstitution: number;
  baseIntelligence: number;
  baseWisdom: number;
  baseCharisma: number;
  defense: number;

  spellSlots: SpellSlot[];
  cantrips: Cantrip[];
  characterClasses: CharacterClass[];
  statuses: Status[];
  inventory: Item[];
  equipment: Item[];
  baseAttacks: Interaction[];
  spells: Spell[];

  resistanceMultiplier(damageType: ElementType): number;
  resistanceAbsolute(damageType: ElementType): number;
};

function getCharacterFromEvents(
  characterEvents: CampaignEvent[],
  characterId: string
): Character {
  return {
    id: characterId,
    name: "Name",
    playerName: "",
    isPlayerControlled: true,
    imageUrl: "/character.png",

    faction: "",
    party: "",
    background: "",
    cantrips: [],
    spellSlots: [],
    statuses: [],
    alignment: Alignment.ChaoticEvil,
    race: Race.Dragonborne,
    characterClasses: [
      {
        clazz: Clazz.Barbarian,
        level: 1,
      },
    ],
    baseArmorClass: 10,
    baseCharisma: 10,
    baseConstitution: 10,
    baseDexterity: 10,
    baseIntelligence: 10,
    baseSpeed: 30,
    baseStrength: 10,
    baseWisdom: 10,
    currentHealth: 10,
    maximumHealth: 10,
    temporaryHealth: 0,
    xp: 0,
    defense: 10,
    inventory: [],
    equipment: getEquipmentFromEvents(characterEvents),
    baseAttacks: getBaseAttacksFromEvents(characterEvents),
    spells: getSpellsFromEvents(characterEvents),
    resistanceMultiplier(damageType: ElementType) {
      return 1;
    },
    resistanceAbsolute(damageType: ElementType) {
      return 0;
    },
  };
}

function getBaseAttacksFromEvents(
  characterEvents: CampaignEvent[]
): Interaction[] {
  return [];
}

function getSpellsFromEvents(characterEvents: CampaignEvent[]): Spell[] {
  return [];
}

function getEquipmentFromEvents(characterEvents: CampaignEvent[]): Item[] {
  return [
    {
      id: generateId("item"),
      name: "Short Sword",
      type: ItemType.Equipment,
      slot: ItemSlot.MainHand,
      interactions: [
        {
          type: InteractionType.Attack,
          name: "Slash attack",
          rangeDistanceMeters: 1,
          eligibleTargets: [TargetType.Character, TargetType.Environment],
          effects: [
            {
              amountVariable: D6,
              amountStatic: 2,
              effectType: EffectType.HealthGain,
              effectElement: ElementType.Radiant,
            },
          ],
        },
      ],
    },
  ];
}
