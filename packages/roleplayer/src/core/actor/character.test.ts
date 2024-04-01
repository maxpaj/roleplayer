import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import { Campaign } from "../campaign/campaign";
import { CampaignEvent } from "../events/events";
import { CharacterResourceDefinition } from "../ruleset/ruleset";
import { ActionDefinition, TargetType } from "../action/action";
import { ItemDefinition, ItemEquipmentType, ItemSlot, ItemType } from "../inventory/item";
import { Rarity } from "../world/rarity";
import { World } from "../world/world";
import { Actor } from "./character";

describe("Character", () => {
  const defaultRuleSet = new DnDRuleset(() => 2);

  describe("Create character events", () => {
    it("should handle create character events", () => {
      const characterA = dangerousGenerateId();
      const characterB = dangerousGenerateId();

      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterA, "Character A");
      campaign.createCharacter(characterB, "Character B");

      const data = campaign.getCampaignStateFromEvents();
      expect(data.characters.length).toBe(2);
    });

    it("should apply maximum health change events", () => {
      const characterId = dangerousGenerateId();

      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const resourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Health",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.getCampaignStateFromEvents();
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === resourceType.id)?.max).toBe(12);
    });

    it("should apply movement events", () => {
      const characterId = dangerousGenerateId();
      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const movementSpeedResource = defaultRuleSet.getCharacterResourceTypes().find((r) => r.name === "Movement speed");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceGain",
          id: dangerousGenerateId(),
          resourceTypeId: movementSpeedResource!.id,
          amount: 35,
          characterId: characterId,
        },
        {
          type: "CharacterPositionSet",
          id: dangerousGenerateId(),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: "CharacterMovement",
          targetPosition: {
            x: 10,
            y: 20,
            z: 0,
          },
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.getCampaignStateFromEvents();
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.position.x).toBe(10);
      expect(characterFromEvents!.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds remaining movement", () => {
      const movementResource: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Movement speed",
      };

      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });

      const characterId = dangerousGenerateId();
      const character = new Actor({
        resources: [
          {
            amount: 35,
            max: 35,
            min: 0,
            resourceTypeId: movementResource.id,
          },
        ],
      });
      character.id = characterId;

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceGain",
          id: dangerousGenerateId(),
          amount: 35,
          characterId: characterId,
          resourceTypeId: movementResource.id,
        },
        {
          type: "CharacterPositionSet",
          id: dangerousGenerateId(),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: "RoundStarted",
          id: dangerousGenerateId(),
        },
        {
          type: "CharacterMovement",
          targetPosition: {
            x: 10,
            y: 50,
            z: 0,
          },
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      expect(campaign.getCampaignStateFromEvents).toThrow();
    });

    it("should apply temporary resource change events", () => {
      const characterId = dangerousGenerateId();
      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });
      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const testResourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 14,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
        {
          type: "CharacterResourceGain",
          amount: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
        {
          type: "CharacterResourceLoss",
          amount: 8,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.getCampaignStateFromEvents();
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.max).toBe(14);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.amount).toBe(4);
    });

    it("should apply item gain events", () => {
      const characterId = dangerousGenerateId();
      const itemId = dangerousGenerateId();
      const world = new World(defaultRuleSet, "World", {
        itemDefinitions: [
          {
            id: itemId,
            rarity: Rarity.Common,
            weightUnits: 1,
            actions: [],
            name: "Item",
            stats: [],
            occupiesSlots: [ItemSlot.Inventory],
            type: ItemType.Equipment,
            description: "",
            equipmentType: ItemEquipmentType.OneHandWeapon,
          },
        ],
      });
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });
      campaign.nextRound();

      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterSpawned",
          id: dangerousGenerateId(),
          characterId: characterId,
        },
        {
          type: "CharacterInventoryItemGain",
          id: dangerousGenerateId(),
          itemInstanceId: dangerousGenerateId(),
          characterId: characterId,
          itemDefinitionId: itemId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.getCampaignStateFromEvents();
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.inventory.length).toBe(1);
    });

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = dangerousGenerateId();

      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "Campaign", world });
      campaign.nextRound();

      const resourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 14,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      campaign.publishCampaignEvent(...events);

      try {
        campaign.getCampaignStateFromEvents();
      } catch (e) {
        // Success
      }
    });

    it("should handle unknown events gracefully", () => {
      const world = new World(defaultRuleSet, "World", {});
      const campaign = new Campaign({ id: dangerousGenerateId(), name: "New campaign", world });
      const events: CampaignEvent[] = [
        {
          type: "Unknown",
          id: dangerousGenerateId(),
        },
      ];

      campaign.nextRound();
      campaign.publishCampaignEvent(...events);

      const data = campaign.getCampaignStateFromEvents();

      expect(data).toBeDefined();
    });
  });

  describe("Character actions", () => {
    it("should return a list of possible actions based on the character class abilities, spells and inventory", () => {
      const world = new World(defaultRuleSet, "World", {});
      const sword: ItemDefinition = {
        id: dangerousGenerateId(),
        rarity: Rarity.Common,
        weightUnits: 1,
        stats: [],
        description: "",
        equipmentType: ItemEquipmentType.OneHandWeapon,
        actions: [
          {
            id: dangerousGenerateId(),
            appliesEffects: [],
            eligibleTargets: [TargetType.Hostile],
            name: "Slash",
            rangeDistanceUnits: 5,
            requiresResources: [],
            description: "",
          },
        ],
        name: "Sword",
        occupiesSlots: [ItemSlot.MainHand],
        type: ItemType.Equipment,
      };

      const healingWord: ActionDefinition = {
        id: dangerousGenerateId(),
        name: "Healing Word (Level 1)",
        appliesEffects: [],
        eligibleTargets: [TargetType.Friendly],
        rangeDistanceUnits: 30,
        requiresResources: [],
        description: "",
      };

      const firebolt: ActionDefinition = {
        id: dangerousGenerateId(),
        appliesEffects: [],
        eligibleTargets: [TargetType.Hostile],
        name: "Firebolt",
        rangeDistanceUnits: 35,
        requiresResources: [
          {
            resourceTypeId: dangerousGenerateId(),
            amount: 1,
          },
        ],
        description: "",
      };

      const char = new Actor({});
      char.equipment = [
        {
          slotId: dangerousGenerateId(),
          item: { id: dangerousGenerateId(), definition: sword },
        },
      ];

      char.actions = [healingWord, firebolt];

      const actions = char.getAvailableActions();
      expect(actions.length).toBe(3);
    });
  });
});
