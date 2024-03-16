import { dangerousGenerateId } from "../../../lib/generate-id";
import { Campaign } from "../../campaign/campaign";
import { CampaignEvent } from "../../campaign/campaign-events";
import { Ruleset } from "../../ruleset/ruleset";
import { Item, ItemEquipmentType, ItemSlot, ItemType } from "../item/item";
import { Rarity } from "../rarity";
import { World } from "../world";
import { EffectType, ElementType } from "./effect";
import { Interaction, TargetType } from "./interaction";
import { Status, StatusApplicationTrigger, StatusDurationType, StatusType } from "./status";

describe("interactions", () => {
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

    const world = new World({ name: "test", ruleset });
    world.statuses = [frozenStatus];
    world.items = [frostSword];

    const action: Interaction = {
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
        type: "CharacterHealthSet",
        healthChange: 10,
        characterId: defenderId,
      },
    ];

    campaign.publishCampaignEvent(...events);

    const beforeAttack = campaign.getCampaignStateFromEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const defender = beforeAttack.characters.find((c) => c.id === defenderId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.name === "Slash");

    campaign.performCharacterAttack(attacker!, 15, characterAction!, defender!);

    const afterAttack = campaign.getCampaignStateFromEvents();
    const defenderFromEvents = afterAttack.characters.find((c) => c.id === defenderId);

    expect(defenderFromEvents!.currentHealth).toBe(8);
    expect(defenderFromEvents!.statuses.find((s) => s.name === "Chill")).toBeDefined();
  });
});
