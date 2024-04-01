import { D10, DnDRuleset } from "../..";
import { Campaign } from "../campaign/campaign";
import { ItemDefinition, ItemEquipmentType, ItemSlot, ItemType } from "../inventory/item";
import { Rarity } from "../world/rarity";
import { World } from "../world/world";
import { TargetType } from "./action";
import { StatusDefinition, StatusDurationType, StatusType } from "./status";

describe("actions", () => {
  const defaultRuleSet = new DnDRuleset(() => 2);
  const coldElement = defaultRuleSet.getElementDefinitions().find((ed) => ed.name === "Cold")!;
  const mainHandEquipmentSlot = defaultRuleSet.getCharacterEquipmentSlots().find((eq) => eq.name === "Main hand")!;
  const healthResource = defaultRuleSet.getCharacterResourceTypes().find((r) => r.name === "Health")!;

  const frozenStatus: StatusDefinition = {
    id: "status-chill",
    name: "Chill",
    duration: 2,
    durationType: StatusDurationType.NumberOfRounds,
    type: StatusType.Magic,
    appliesEffects: [
      {
        effect: {
          eventType: "CharacterResourceLoss",
          elementTypeId: coldElement.id,
          resourceTypeId: healthResource.id,
          staticValue: 2,
          variableValue: D10,
        },
        appliesAt: "RoundStarted",
      },
    ],
  };

  const frostSword: ItemDefinition = {
    id: "item-frost-sword",
    description: "",
    equipmentType: ItemEquipmentType.OneHandWeapon,
    weightUnits: 1,
    rarity: Rarity.Rare,
    actions: [
      {
        id: "action-frost-sword-slash",
        description: "",
        appliesEffects: [
          {
            eventType: "CharacterResourceLoss",
            parameters: {
              variableValue: D10,
              staticValue: 2,
              resourceTypeId: healthResource.id,
              elementTypeId: coldElement.id,
            },
          },
          {
            eventType: "CharacterStatusGain",
            parameters: {
              statusId: frozenStatus.id,
            },
          },
        ],
        eligibleTargets: [TargetType.Hostile],
        name: "Slash",
        rangeDistanceUnits: 5,
        requiresResources: [],
      },
    ],
    name: "Sword of Frost",
    occupiesSlots: [ItemSlot.MainHand],
    type: ItemType.Equipment,
    stats: [],
  };

  const world = new World(defaultRuleSet, "Test world", {});
  world.statuses = [frozenStatus];
  world.itemDefinitions = [frostSword];

  it("should apply effects from being hit", () => {
    const campaign = new Campaign({
      id: "00000000-0000-0000-0000-000000000000" as const,
      name: "Test campaign",
      world,
    });

    campaign.nextRound();

    const attackerId = "attacker-id";
    const defenderId = "defender-id";

    // Setup attacker
    campaign.createCharacter(attackerId, "Attacker");
    campaign.addCharacterItem(attackerId, frostSword.id);

    const afterAddSword = campaign.getCampaignStateFromEvents();
    const characterWithSword = afterAddSword.characters.find((c) => c.id === attackerId);
    campaign.characterEquipItem(attackerId, mainHandEquipmentSlot.id, characterWithSword!.inventory[0]!.id);

    // Setup defender
    campaign.createCharacter(defenderId, "Defender");
    campaign.nextRound();

    const beforeAttack = campaign.getCampaignStateFromEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.id === "action-frost-sword-slash");
    const defenderBeforeAttack = beforeAttack.characters.filter((c) => c.id === defenderId);

    campaign.performCharacterAttack(attacker!, characterAction!, defenderBeforeAttack);

    const afterAttack = campaign.getCampaignStateFromEvents();
    const defenderAfterAttack = afterAttack.characters.find((c) => c.id === defenderId);
    const defenderHealth = defenderAfterAttack!.resources.find((r) => r.resourceTypeId === healthResource.id)?.amount;
    const defenderChillStatus = defenderAfterAttack!.statuses.find((s) => s.name === "Chill");

    expect(defenderHealth).toBe(6);
    expect(defenderChillStatus).toBeDefined();
  });
});
