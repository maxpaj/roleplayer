import { generateId } from "../id";
import { TargetType } from "../interaction/interaction";
import { Item, ItemSlot, ItemType, Rarity } from "../item/item";
import { Character, Spell } from "./character";

describe("Character interactions", () => {
  it("should return a list of possible interactions based on the character class abilities, spells and inventory", () => {
    const sword: Item = {
      id: generateId("item"),
      rarity: Rarity.Common,
      actions: [
        {
          id: generateId("action"),
          appliesEffects: [],
          eligibleTargets: [TargetType.Hostile],
          name: "Slash",
          rangeDistanceMeters: 5,
        },
      ],
      name: "Sword",
      slots: [ItemSlot.MainHand],
      type: ItemType.Equipment,
    };

    const spell: Spell = {
      id: generateId("spell"),
      name: "Healing Word",
      level: 1,
      action: {
        id: generateId("action"),
        appliesEffects: [],
        eligibleTargets: [TargetType.Friendly],
        name: "Healing Word",
        rangeDistanceMeters: 30,
      },
    };

    const char = new Character();
    char.equipment = [sword];
    char.spells = [spell];
    char.baseActions = [
      {
        id: generateId("action"),
        appliesEffects: [],
        eligibleTargets: [TargetType.Hostile],
        name: "Firebolt",
        rangeDistanceMeters: 35,
      },
    ];

    const actions = char.getAvailableActions();
    expect(actions.length).toBe(3);
  });
});
