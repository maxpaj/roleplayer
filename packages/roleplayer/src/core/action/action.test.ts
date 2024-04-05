import { CampaignState, D10, DnDRuleset } from "../..";
import { ItemDefinition, ItemEquipmentType, ItemSlot, ItemType } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import { Rarity } from "../world/rarity";
import { World } from "../world/world";
import { TargetType } from "./action";
import { StatusDefinition, StatusDurationType, StatusType } from "./status";

const roleplayer = new Roleplayer({});
const ruleset = new DnDRuleset(() => 2);

describe("actions", () => {
  const coldElement = ruleset.getElementDefinitions().find((ed) => ed.name === "Cold")!;
  const mainHandEquipmentSlot = ruleset.getCharacterEquipmentSlots().find((eq) => eq.name === "Main hand")!;
  const healthResource = ruleset.getCharacterResourceTypes().find((r) => r.name === "Health")!;

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

  const world = new World(ruleset, "Test world", {});
  world.statuses = [frozenStatus];
  world.itemTemplates = [frostSword];

  it("should apply effects from being hit", () => {
    const campaign = new CampaignState({
      id: "00000000-0000-0000-0000-000000000000" as const,
      ruleset,
      roleplayer,
    });

    roleplayer.nextRound();

    const attackerId = "attacker-id";
    const defenderId = "defender-id";

    // Setup attacker
    roleplayer.createCharacter(attackerId, "Attacker");
    roleplayer.addCharacterItem(attackerId, frostSword.id);

    const afterAddSword = roleplayer.getCampaignFromEvents();
    const characterWithSword = afterAddSword.characters.find((c) => c.id === attackerId);
    roleplayer.characterEquipItem(attackerId, mainHandEquipmentSlot.id, characterWithSword!.inventory[0]!.id);

    // Setup defender
    roleplayer.createCharacter(defenderId, "Defender");
    roleplayer.nextRound();

    const beforeAttack = roleplayer.getCampaignFromEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.id === "action-frost-sword-slash");
    const defenderBeforeAttack = beforeAttack.characters.filter((c) => c.id === defenderId);

    roleplayer.performCharacterAttack(attacker!, characterAction!, defenderBeforeAttack);

    const afterAttack = roleplayer.getCampaignFromEvents();
    const defenderAfterAttack = afterAttack.characters.find((c) => c.id === defenderId);
    const defenderHealth = defenderAfterAttack!.resources.find((r) => r.resourceTypeId === healthResource.id)?.amount;
    const defenderChillStatus = defenderAfterAttack!.statuses.find((s) => s.name === "Chill");

    expect(defenderHealth).toBe(6);
    expect(defenderChillStatus).toBeDefined();
  });
});
