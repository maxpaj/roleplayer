import { Campaign, CampaignEventType } from "../campaign/campaign";
import { Character } from "../character/character";
import { generateId } from "../id";
import { Item, ItemSlot, ItemType } from "../item/item";
import { EffectType, ElementType } from "./effect";
import { InteractionType, TargetType } from "./interaction";
import {
  Status,
  StatusApplicationTrigger,
  StatusDurationType,
  StatusType,
} from "./status";

describe("interactions", () => {
  it("should apply effects from being hit", () => {
    const char = new Character();
    char.id = generateId("char");

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

    const sword: Item = {
      id: generateId("item"),
      actions: [
        {
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
          type: InteractionType.Attack,
        },
      ],
      name: "Sword of Frost",
      slots: [ItemSlot.MainHand],
      type: ItemType.Equipment,
    };
    char.equipment.push(sword);

    const actions = char.getAvailableActions();
    const action = actions.find((a) => a.name === "Slash");
    if (!action) {
      throw new Error("Could not find attack");
    }

    const otherCharId = generateId("char");
    const otherChar = new Character();
    otherChar.id = otherCharId;
    otherChar.defense = 4;

    const campaign = new Campaign([], [], [], [], [], [], []);
    campaign.statuses = [frozenStatus];
    campaign.characters = [char, otherChar];
    campaign.events = [
      {
        id: generateId("event"),
        eventType: CampaignEventType.CharacterHealthChangeAbsolute,
        amount: 10,
        characterId: otherCharId,
      },
    ];

    campaign.performCharacterAttack(char, 15, action.appliesEffects, otherChar);
    const otherCharacterFromEvents =
      campaign.getCharacterFromEvents(otherCharId);
    expect(otherCharacterFromEvents.currentHealth).toBe(8);
    expect(
      otherCharacterFromEvents.statuses.find((s) => s.name === "Chill")
    ).toBeDefined();
  });
});
