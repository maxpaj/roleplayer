import { CharacterResourceType } from "../../..";
import { dangerousGenerateId } from "../../../lib/generate-id";
import { Campaign } from "../../campaign/campaign";
import { CampaignEvent } from "../../campaign/campaign-events";
import { Ruleset } from "../../ruleset/ruleset";
import { Item, ItemEquipmentType, ItemSlot, ItemType } from "../item/item";
import { Rarity } from "../rarity";
import { World } from "../world";
import { EffectType, ElementType } from "./effect";
import { Action, TargetType } from "./action";
import { Status, StatusApplicationTrigger, StatusDurationType, StatusType } from "./status";

describe("actions", () => {
  const frozenStatus: Status = {
    id: dangerousGenerateId(),
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
    id: dangerousGenerateId(),
    rarity: Rarity.Rare,
    actions: [
      {
        id: dangerousGenerateId(),
        description: "",
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
      id: dangerousGenerateId(),
      name: "Main hand",
    };

    const ruleset = new Ruleset();
    ruleset.characterEquipmentSlots = [equipmentSlot];

    const healthResource: CharacterResourceType = {
      id: dangerousGenerateId(),
      name: "Health",
      defaultMax: 20,
    };

    const primaryActionResource: CharacterResourceType = {
      id: dangerousGenerateId(),
      name: "Primary action",
      defaultMax: 20,
    };

    ruleset.characterResourceTypes = [healthResource, primaryActionResource];

    const world = new World({ name: "test", ruleset });
    world.statuses = [frozenStatus];
    world.items = [frostSword];

    const action: Action = {
      description: "",
      id: dangerousGenerateId(),
      appliesEffects: [
        {
          element: ElementType.Slashing,
          type: EffectType.HealthLoss,
          amountStatic: 2,
          amountVariable: 0,
          appliesStatusId: frozenStatus.id,
        },
      ],
      eligibleTargets: [],
      name: "Slash",
      rangeDistanceMeters: 10,
      requiresResources: [],
    };

    world.actions = [action];

    const campaign = new Campaign({ id: "0000000-0000-0000-0000-000000000000" as const, name: "test", world });
    campaign.nextRound();

    const attackerId = dangerousGenerateId();
    const defenderId = dangerousGenerateId();

    campaign.createCharacter(attackerId, "Attacker");
    campaign.addCharacterEquipmentSlot(attackerId, equipmentSlot.id);
    campaign.addCharacterItem(attackerId, frostSword.id);

    campaign.createCharacter(defenderId, "Defender");
    campaign.nextRound();

    const events: CampaignEvent[] = [
      {
        id: dangerousGenerateId(),
        type: "CharacterResourceCurrentChange",
        amount: 10,
        resourceTypeId: healthResource.id,
        characterId: defenderId,
      },
    ];

    campaign.publishCampaignEvent(...events);

    const beforeAttack = campaign.getCampaignStateFromEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const defenderBeforeAttack = beforeAttack.characters.find((c) => c.id === defenderId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.name === "Slash");

    campaign.performCharacterAttack(attacker!, 15, characterAction!, defenderBeforeAttack!);

    const afterAttack = campaign.getCampaignStateFromEvents();
    const defenderAfterAttack = afterAttack.characters.find((c) => c.id === defenderId);

    expect(defenderAfterAttack!.resources.find((r) => r.resourceTypeId === healthResource.id)?.amount).toBe(8);
    expect(defenderAfterAttack!.statuses.find((s) => s.name === "Chill")).toBeDefined();
  });
});
