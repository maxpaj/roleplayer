export enum Alignment {
  Evil = "Evil",
  Good = "Good",
  Neutral = "Neutral",
}

export enum Race {
  Gnome = "Gnome",
  Dwarf = "Dwarf",
  Elf = "Elf",
  HalfElf = "Half elf",
  Human = "Human",
  Thiefling = "Thiefling",
}

export enum Clazz {
  Rogue = "Rogue",
  Bard = "Bard",
  Ranger = "Ranger",
  Sorceress = "Sorceress",
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
