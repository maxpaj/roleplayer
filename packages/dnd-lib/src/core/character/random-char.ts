import { Id, generateId } from "../../id";
import { Alignment, Clazz, Race, Character } from "./character";
import { EffectType, ElementType } from "../interaction/effect";
import { D2, D6 } from "../dice/dice";
import { ItemSlot, ItemType, Rarity } from "../item/item";
import { TargetType } from "../interaction/interaction";

function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum) as T[keyof T][];
  const randomIndex = Math.floor((Math.random() * enumValues.length) / 2);
  const randomEnum = enumValues[randomIndex];
  if (!randomEnum) {
    throw new Error("Could not get random enum");
  }
  return randomEnum;
}

function randomDigit(min: number, max: number) {
  const variable = max - min;
  return min + Math.floor(Math.random() * variable);
}

function randomClass(): Clazz {
  return {
    id: generateId("class"),
    levelProgression: [],
    name: "Random class",
  };
}

function randomRace(): Race {
  return { name: "Random race" };
}

export function randomCharacter(id: Id): Character {
  return new Character({
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
    race: randomRace(),
    classes: [
      {
        clazz: randomClass(),
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
    defense: 10,
    inventory: [],
    equipment: [
      {
        id: generateId("item"),
        rarity: Rarity.Common,
        name: "Short Sword",
        type: ItemType.Equipment,
        slots: [ItemSlot.MainHand, ItemSlot.OffHand],
        actions: [
          {
            id: generateId("action"),
            name: "Slash attack",
            rangeDistanceMeters: 1,
            eligibleTargets: [TargetType.Character, TargetType.Environment],
            appliesEffects: [
              {
                amountVariable: D6,
                amountStatic: 2,
                type: EffectType.HealthLoss,
                element: ElementType.Slashing,
              },
            ],
          },
        ],
      },
    ],
    baseActions: [
      {
        id: generateId("action"),
        name: "Unarmed attack",
        rangeDistanceMeters: 1,
        eligibleTargets: [TargetType.Hostile, TargetType.Friendly],
        appliesEffects: [
          {
            amountStatic: 2,
            amountVariable: D2,
            type: EffectType.HealthLoss,
            element: ElementType.Bludgeoning,
          },
        ],
      },
    ],
    spells: [],
    getResistanceMultiplier(damageType: ElementType) {
      return 1;
    },
    getResistanceAbsolute(damageType: ElementType) {
      return 0;
    },
  });
}
