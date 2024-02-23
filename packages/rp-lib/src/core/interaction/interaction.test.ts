import { generateId } from "../../lib/generate-id";
import { Campaign } from "../campaign/campaign";
import { Character } from "../character/character";
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
    id: generateId(),
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
    id: generateId(),
    rarity: Rarity.Rare,
    actions: [
      {
        id: generateId(),
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
    attacker.id = generateId();
    attacker.equipment.push(frostSword);

    const actions = attacker.getAvailableActions();
    const action = actions.find((a) => a.name === "Slash");
    if (!action) {
      throw new Error("Could not find attack");
    }

    const defenderId = generateId();
    const defender = new Character();
    defender.id = defenderId;
    defender.defense = 4;

    const campaign = new Campaign({ name: "test" });
    campaign.statuses = [frozenStatus];
    campaign.characters = [attacker, defender];
    campaign.rounds = [{ id: generateId() }];
    campaign.events = [
      {
        id: generateId(),
        type: "CharacterHealthChange",
        healthChange: 10,
        characterId: defenderId,
        roundId: generateId(),
      },
    ];

    campaign.performCharacterAttack(attacker, 15, action, defender);

    campaign.applyEvents();

    const defenderFromEvents = campaign.characters.find(
      (c) => c.id === defenderId
    );
    expect(defenderFromEvents!.currentHealth).toBe(8);
    expect(
      defenderFromEvents!.statuses.find((s) => s.name === "Chill")
    ).toBeDefined();
  });
});
