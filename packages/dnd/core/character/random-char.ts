import { Id, generateId } from "../id";
import { Alignment, Character, Clazz, Race } from "./character";
import { EffectType, ElementType } from "../interaction/effect";
import { D2, D6 } from "../dice/dice";
import { ItemSlot, ItemType } from "../item/item";
import { InteractionType, TargetType } from "../interaction/interaction";

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
    defense: 10,
    inventory: [],
    equipment: [
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
                effectType: EffectType.HealthLoss,
                effectElement: ElementType.Slashing,
              },
            ],
          },
        ],
      },
    ],
    baseAttacks: [
      {
        name: "Unarmed attack",
        rangeDistanceMeters: 1,
        eligibleTargets: [TargetType.Hostile, TargetType.Friendly],
        type: InteractionType.Attack,
        effects: [
          {
            amountStatic: 2,
            amountVariable: D2,
            effectType: EffectType.HealthLoss,
            effectElement: ElementType.Bludgeoning,
          },
        ],
      },
    ],
    spells: [],
    resistanceMultiplier(damageType: ElementType) {
      return 1;
    },
    resistanceAbsolute(damageType: ElementType) {
      return 0;
    },
  };
}
