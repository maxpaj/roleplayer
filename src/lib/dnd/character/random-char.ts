import { Id } from "@/lib/dnd/id";
import { Alignment, Character, Clazz, Race } from "./character";

function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum) as T[keyof T][];
  const randomIndex = Math.floor((Math.random() * enumValues.length) / 2);
  return enumValues[randomIndex];
}

function randomDigit(min: number, max: number) {
  const variable = max - min;
  return min + Math.floor(Math.random() * variable);
}

export function randomCharacter(id: Id): Character {
  return {
    id,
    name: "Name",
    playerName: "",
    isPlayerControlled: true,
    faction: "",
    imageUrl: "/character.png",
    party: "",
    background: "",
    cantrips: [],
    spellSlots: [],
    statuses: [],
    alignment: randomEnum(Alignment),
    race: randomEnum(Race),
    characterClasses: [
      {
        clazz: randomEnum(Clazz),
        level: 1,
      },
    ],
    baseArmorClass: randomDigit(0, 10),
    baseCharisma: randomDigit(0, 10),
    baseConstitution: randomDigit(0, 10),
    baseDexterity: randomDigit(0, 10),
    baseIntelligence: randomDigit(0, 10),
    baseSpeed: randomDigit(0, 30),
    baseStrength: randomDigit(0, 10),
    baseWisdom: randomDigit(0, 10),
    currentHealth: randomDigit(0, 10),
    maximumHealth: randomDigit(0, 10),
    temporaryHealth: 0,
    xp: 0,
    getAttacks() {
      return [];
    },
    getDefense(events) {
      return 10;
    },
    getResistanceMultiplier(element) {
      return 1;
    },
    getSpells() {
      return [];
    },
  };
}
