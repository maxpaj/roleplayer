import { D10, DnDRuleset, ElementDefinition } from "../..";
import { Campaign } from "../campaign/campaign";
import { Item, ItemSlot, ItemType } from "../inventory/item";
import { Rarity } from "../world/rarity";
import { World } from "../world/world";
import { CharacterResourceLossEffect, CharacterStatusGainEffect } from "./effect";
import { TargetType } from "./action";
import { StatusDefinition, StatusApplicationTrigger, StatusDurationType, StatusType } from "./status";

describe("actions", () => {
  const defaultRuleSet = new DnDRuleset(() => 2);

  const element: ElementDefinition = {
    id: "element-cold",
    name: "Cold",
  };

  const mainHandEquipmentSlot = defaultRuleSet.getCharacterEquipmentSlots().find((eq) => eq.name === "Main hand")!;

  const healthResource = defaultRuleSet.getCharacterResourceTypes().find((r) => r.name === "Health")!;

  const frozenStatus: StatusDefinition = {
    id: "status-chill",
    name: "Chill",
    durationRounds: 2,
    durationType: StatusDurationType.NumberOfRounds,
    type: StatusType.Magic,
    appliesEffects: [
      {
        effect: new CharacterResourceLossEffect(element, D10, 2, healthResource.id),
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
          new CharacterResourceLossEffect(element, D10, 2, healthResource.id),
          new CharacterStatusGainEffect(frozenStatus),
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
    stats: [],
  };

  it("should apply effects from being hit", () => {
    const world = new World(defaultRuleSet, "Test world", {});
    world.statuses = [frozenStatus];
    world.items = [frostSword];
    world.actions = frostSword.actions;

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
    campaign.addCharacterEquipmentSlot(attackerId, mainHandEquipmentSlot.id);
    campaign.addCharacterItem(attackerId, frostSword.id);

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

    expect(defenderHealth).toBe(2);
    expect(defenderChillStatus).toBeDefined();
  });
});
