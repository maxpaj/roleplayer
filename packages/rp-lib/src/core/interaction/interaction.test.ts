import { generateId } from "../../lib/generate-id";
import { Campaign, CampaignEvent } from "../campaign/campaign";
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
    const campaign = new Campaign({ name: "test" });
    campaign.statuses = [frozenStatus];
    campaign.items = [];

    const actionId = generateId();
    campaign.actions = [
      {
        id: actionId,
        appliesEffects: [],
        eligibleTargets: [],
        name: "Slash",
        rangeDistanceMeters: 10,
      },
    ];

    const attackerId = generateId();
    const defenderId = generateId();

    campaign.createCharacter(attackerId, "Attacker");
    campaign.addCharacterAction(attackerId, actionId);
    campaign.createCharacter(defenderId, "Defender");
    campaign.newRound();

    const events: CampaignEvent[] = [
      {
        id: generateId(),
        type: "CharacterHealthChange",
        healthChange: 10,
        characterId: defenderId,
      },
    ];

    campaign.publishCampaignEvent(...events);

    const beforeAttack = campaign.applyEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const defender = beforeAttack.characters.find((c) => c.id === attackerId);
    const actions = attacker!.getAvailableActions();
    const action = actions.find((a) => a.name === "Slash");

    campaign.performCharacterAttack(attacker!, 15, action!, defender!);

    const afterAttack = campaign.applyEvents();
    const defenderFromEvents = afterAttack.characters.find(
      (c) => c.id === defenderId
    );

    expect(defenderFromEvents!.currentHealth).toBe(8);
    expect(
      defenderFromEvents!.statuses.find((s) => s.name === "Chill")
    ).toBeDefined();
  });
});
