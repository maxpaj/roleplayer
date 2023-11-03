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
  HalfElf = "Half-Elf",
  Halfling = "Halfling",
  HalfOrc = "Half-Orc",
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

export type Attack = {};

export type Cantrip = {};

export type CharacterClass = {
  level: number;
  clazz: Clazz;
};

export type Status = {};

export type Character = {
  party: string;
  id: string;
  isPlayerControlled: boolean;
  statuses: Status[];

  name: string;
  playerName: string;
  imageUrl: string;

  characterClasses: CharacterClass[];
  background: string;
  faction: string;
  race: Race;
  alignment: Alignment;
  xp: number;

  spellSlots: SpellSlot[];
  attacks: Attack[];
  cantrips: Cantrip[];
  spells: Spell[];

  maximumHealth: number;
  currentHealth: number;
  temporaryHealth: number;

  baseSpeed: number;
  baseArmor: number;
  baseStrength: number;
  baseDexterity: number;
  baseConstitution: number;
  baseIntelligence: number;
  baseWisdom: number;
  baseCharisma: number;
};
