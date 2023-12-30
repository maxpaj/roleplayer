import { Campaign, CampaignEventType } from "../campaign/campaign";
import { Character } from "../character/character";
import { generateId } from "../id";
import { ItemSlot, ItemType } from "../item/item";
import { EffectType, ElementType } from "./effect";
import { InteractionType, TargetType } from "./interaction";

describe("interactions", () => {
  it("should apply effects from being hit by a sword", () => {
    const char = new Character();
    char.id = generateId("char");
    char.equipment.push({
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
          ],
          eligibleTargets: [TargetType.Hostile],
          name: "Slash",
          rangeDistanceMeters: 5,
          type: InteractionType.Attack,
        },
      ],
      name: "Sword",
      slots: [ItemSlot.MainHand],
      type: ItemType.Equipment,
    });

    const actions = char.getAvailableActions();
    const action = actions.find((a) => a.name === "Slash");
    if (!action) {
      throw new Error("Could not find attack");
    }

    const otherCharId = generateId("char");
    const otherChar = new Character();
    otherChar.id = otherCharId;
    otherChar.defense = 4;

    const campaign = new Campaign();
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
    expect(campaign.getCharacterFromEvents(otherCharId).currentHealth).toBe(8);
  });
});
