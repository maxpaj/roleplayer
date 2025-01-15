import { DnDRuleset, SystemEventType, generateId } from "../..";
import {
  addCharacterItem,
  characterEquipItem,
  createCharacter,
  nextRound,
  performCharacterAttack,
  startCampaign,
} from "../actions";
import { ItemEquipmentType, ItemSlot, ItemType, type ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import { Rarity } from "../world/rarity";
import { TargetType } from "./action";
import { StatusDurationType, StatusType, type StatusDefinition } from "./status";

describe("actions", () => {
  const ruleset = new DnDRuleset((str) => {
    const [, staticValue = "0"] = str.split("+");
    return 2 + +staticValue;
  });

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
          roll: "D10+2",
        },
        appliesAt: SystemEventType.RoundStarted,
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
            roll: "D10+2",
            resourceTypeId: healthResource.id,
            elementTypeId: coldElement.id,
          },
          {
            eventType: "CharacterStatusGain",
            statusId: frozenStatus.id,
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

  const roleplayer = new Roleplayer(
    { ruleset },
    { id: generateId(), itemTemplates: [frostSword], statuses: [frozenStatus] }
  );

  it("should apply effects from being hit", () => {
    roleplayer.dispatchAction(startCampaign());

    const attackerId = "attacker-id";
    const defenderId = "defender-id";

    // Setup attacker
    roleplayer.dispatchAction(createCharacter(attackerId, "Attacker"));
    roleplayer.dispatchAction(addCharacterItem(attackerId, frostSword.id));

    const afterAddSword = roleplayer.campaign;
    const characterWithSword = afterAddSword.characters.find((c) => c.id === attackerId);
    roleplayer.dispatchAction(
      characterEquipItem(attackerId, mainHandEquipmentSlot.id, characterWithSword!.inventory[0]!.id)
    );

    // Setup defender
    roleplayer.dispatchAction(createCharacter(defenderId, "Defender"));
    roleplayer.dispatchAction(nextRound());

    const beforeAttack = roleplayer.campaign;
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.id === "action-frost-sword-slash");
    const defenderBeforeAttack = beforeAttack.characters.filter((c) => c.id === defenderId);

    roleplayer.dispatchAction(performCharacterAttack(attacker!, characterAction!, defenderBeforeAttack));

    const afterAttack = roleplayer.campaign;
    const defenderAfterAttack = afterAttack.characters.find((c) => c.id === defenderId);
    const defenderHealth = defenderAfterAttack!.resources.find((r) => r.resourceTypeId === healthResource.id)?.amount;
    const defenderChillStatus = defenderAfterAttack!.statuses.find((s) => s.name === "Chill");

    expect(defenderHealth).toBe(6);
    expect(defenderChillStatus).toBeDefined();
  });
});
