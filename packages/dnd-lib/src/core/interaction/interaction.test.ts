import { Campaign } from "../campaign/campaign";
import { Character } from "../character/character";
import { generateId } from "../../id";
import { Item, ItemSlot, ItemType, Rarity } from "../item/item";
import { EffectType, ElementType } from "./effect";
import { TargetType } from "./interaction";
import {
  Status,
  StatusApplicationTrigger,
  StatusDurationType,
  StatusType,
} from "./status";

describe("interactions", () => {
  const frozenStatus: Status = {
    id: generateId("status"),
    name: "Chill",
    durationRounds: 2,
    durationType: StatusDurationType.NumberOfRounds,
    type: StatusType.Magic,
    appliesEffects: [
      {
        effect: {
          element: ElementType.Cold,
          type: EffectType.HealthLoss,
          amountStatic: 2,
          amountVariable: 0,
        },
        appliesAt: StatusApplicationTrigger.RoundStart,
      },
    ],
  };

  const frostSword: Item = {
    id: generateId("item"),
    rarity: Rarity.Rare,
    actions: [
      {
        id: generateId("action"),
        appliesEffects: [
          {
            element: ElementType.Slashing,
            type: EffectType.HealthLoss,
            amountStatic: 2,
            amountVariable: 0,
          },
          {
            element: ElementType.Cold,
            type: EffectType.StatusGain,
            appliesStatusId: frozenStatus.id,
          },
        ],
        eligibleTargets: [TargetType.Hostile],
        name: "Slash",
        rangeDistanceMeters: 5,
      },
    ],
    name: "Sword of Frost",
    slots: [ItemSlot.MainHand],
    type: ItemType.Equipment,
  };

  it("should apply effects from being hit", () => {
    const attacker = new Character();
    attacker.id = generateId("char");
    attacker.equipment.push(frostSword);

    const actions = attacker.getAvailableActions();
    const action = actions.find((a) => a.name === "Slash");
    if (!action) {
      throw new Error("Could not find attack");
    }

    const defenderId = generateId("char");
    const defender = new Character();
    defender.id = defenderId;
    defender.defense = 4;

    const campaign = new Campaign(generateId, { id: "test", name: "test" });
    campaign.statuses = [frozenStatus];
    campaign.characters = [attacker, defender];
    campaign.rounds = [{ id: generateId("round") }];
    campaign.events = [
      {
        id: generateId("event"),
        type: "CharacterHealthChange",
        amount: 10,
        characterId: defenderId,
        roundId: generateId("round"),
      },
    ];

    campaign.performCharacterAttack(attacker, 15, action, defender);

    const defenderFromEvents = campaign.getCharacterFromEvents(defenderId);
    expect(defenderFromEvents.currentHealth).toBe(8);
    expect(
      defenderFromEvents.statuses.find((s) => s.name === "Chill")
    ).toBeDefined();
  });
});
