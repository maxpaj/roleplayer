import { CharacterResourceType, DefaultRuleSet } from "../../..";
import { dangerousGenerateId } from "../../../lib/generate-id";
import { Campaign } from "../../campaign/campaign";
import { CampaignEvent } from "../../campaign/campaign-events";
import { Item, ItemEquipmentType, ItemSlot, ItemType } from "../item/item";
import { Rarity } from "../rarity";
import { World } from "../world";
import { ElementType } from "./effect";
import { TargetType } from "./action";
import { Status, StatusApplicationTrigger, StatusDurationType, StatusType } from "./status";

describe("actions", () => {
  const frozenStatus: Status = {
    id: "status-chill",
    name: "Chill",
    durationRounds: 2,
    durationType: StatusDurationType.NumberOfRounds,
    type: StatusType.Magic,
    appliesEffects: [
      {
        effect: {
          element: ElementType.Cold,
          eventType: "CharacterResourceLoss",
        },
        appliesAt: StatusApplicationTrigger.RoundStart,
      },
    ],
  };

  const frostSword: Item = {
    id: "item-frost-sword",
    rarity: Rarity.Rare,
    actions: [
      {
        id: "action-frost-sword-slash",
        description: "",
        appliesEffects: [
          {
            element: ElementType.Slashing,
            eventType: "CharacterStatusGain",
          },
          {
            element: ElementType.Cold,
            eventType: "CharacterResourceLoss",
          },
        ],
        eligibleTargets: [TargetType.Hostile],
        name: "Slash",
        rangeDistanceUnit: 5,
        requiresResources: [],
      },
    ],
    name: "Sword of Frost",
    occupiesSlots: [ItemSlot.MainHand],
    type: ItemType.Equipment,
  };

  it("should apply effects from being hit", () => {
    const equipmentSlot = {
      eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
      id: "main-hand-equipment-slot-id",
      name: "Main hand",
    };

    const ruleset = DefaultRuleSet;
    ruleset.characterEquipmentSlots = [equipmentSlot];

    const healthResource: CharacterResourceType = {
      id: "health-resource-id",
      name: "Health",
      defaultMax: 20,
    };

    const primaryActionResource: CharacterResourceType = {
      id: "action-resource-id",
      name: "Primary action",
      defaultMax: 20,
    };

    ruleset.characterResourceTypes = [healthResource, primaryActionResource];

    const world = new World(DefaultRuleSet, () => 2, "Test world", {});
    world.statuses = [frozenStatus];
    world.items = [frostSword];
    world.actions = frostSword.actions;

    const campaign = new Campaign({ id: "0000000-0000-0000-0000-000000000000" as const, name: "Test campaign", world });
    campaign.nextRound();

    const attackerId = "attacker-id";
    const defenderId = "defender-id";

    // Setup attacker
    campaign.createCharacter(attackerId, "Attacker");
    campaign.addCharacterEquipmentSlot(attackerId, equipmentSlot.id);
    campaign.addCharacterItem(attackerId, frostSword.id);

    // Setup defender
    campaign.createCharacter(defenderId, "Defender");

    campaign.nextRound();

    const events: CampaignEvent[] = [
      {
        id: dangerousGenerateId(),
        type: "CharacterResourceGain",
        amount: 10,
        resourceTypeId: healthResource.id,
        characterId: defenderId,
      },
    ];

    campaign.publishCampaignEvent(...events);

    const beforeAttack = campaign.getCampaignStateFromEvents();

    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.id === "action-frost-sword-slash");
    const defenderBeforeAttack = beforeAttack.characters.filter((c) => c.id === defenderId);

    campaign.performCharacterAttack(attacker!, characterAction!, defenderBeforeAttack);

    const afterAttack = campaign.getCampaignStateFromEvents();
    const defenderAfterAttack = afterAttack.characters.find((c) => c.id === defenderId);

    expect(defenderAfterAttack!.resources.find((r) => r.resourceTypeId === healthResource.id)?.amount).toBe(8);
    expect(defenderAfterAttack!.statuses.find((s) => s.name === "Chill")).toBeDefined();
  });
});
