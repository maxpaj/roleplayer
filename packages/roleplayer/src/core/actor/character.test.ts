import { CampaignState } from "../..";
import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import { TargetType, type ActionDefinition } from "../action/action";
import type { RoleplayerEvent } from "../events/events";
import { ItemEquipmentType, ItemSlot, ItemType, type ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import type { CharacterResourceDefinition } from "../ruleset/ruleset";
import { Rarity } from "../world/rarity";
import { World } from "../world/world";
import { Actor } from "./character";

const roleplayer = new Roleplayer({});

describe("Character", () => {
  const ruleset = new DnDRuleset(() => 2);

  beforeEach(() => {
    roleplayer.events = [];
  });

  describe("Create character events", () => {
    it("should handle create character events", () => {
      const characterA = dangerousGenerateId();
      const characterB = dangerousGenerateId();

      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });

      roleplayer.nextRound();
      roleplayer.createCharacter(characterA, "Character A");
      roleplayer.createCharacter(characterB, "Character B");

      const data = roleplayer.getCampaignFromEvents(campaign.id);
      expect(data.characters.length).toBe(2);
    });

    it("should apply maximum health change events", () => {
      const characterId = dangerousGenerateId();

      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), roleplayer });

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const resourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Health",
        defaultMax: 20,
      };

      const events: RoleplayerEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      roleplayer.publishEvent(campaign.id, ...events);

      const data = roleplayer.getCampaignFromEvents(campaign.id);
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === resourceType.id)?.max).toBe(12);
    });

    it("should apply movement events", () => {
      const characterId = dangerousGenerateId();
      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), roleplayer, ruleset });

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const movementSpeedResource = ruleset.getCharacterResourceTypes().find((r) => r.name === "Movement speed");

      const events: RoleplayerEvent[] = [
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

      roleplayer.publishEvent(campaign.id, ...events);

      const data = roleplayer.getCampaignFromEvents(campaign.id);
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.position.x).toBe(10);
      expect(characterFromEvents!.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds remaining movement", () => {
      const movementResource: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Movement speed",
      };

      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });

      const characterId = dangerousGenerateId();
      const character = new Actor({
        world,
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

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const events: RoleplayerEvent[] = [
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

      roleplayer.publishEvent(campaign.id, ...events);

      expect(roleplayer.getCampaignFromEvents(campaign.id)).toThrow();
    });

    it("should apply temporary resource change events", () => {
      const characterId = dangerousGenerateId();
      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });
      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const testResourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: RoleplayerEvent[] = [
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

      roleplayer.publishEvent(campaign.id, ...events);

      const data = roleplayer.getCampaignFromEvents(campaign.id);
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.max).toBe(14);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.amount).toBe(4);
    });

    it("should apply item gain events", () => {
      const characterId = dangerousGenerateId();
      const itemId = dangerousGenerateId();
      const world = new World(ruleset, "World", {
        itemTemplates: [
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
      const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const events: RoleplayerEvent[] = [
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

      roleplayer.publishEvent(campaign.id, ...events);

      const data = roleplayer.getCampaignFromEvents(campaign.id);
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.inventory.length).toBe(1);
    });

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = dangerousGenerateId();

      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });

      roleplayer.nextRound();

      const resourceType: CharacterResourceDefinition = {
        id: dangerousGenerateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: RoleplayerEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 14,
          id: dangerousGenerateId(),
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      roleplayer.publishEvent(campaign.id, ...events);

      try {
        roleplayer.getCampaignFromEvents(campaign.id);
      } catch (e) {
        // Success
      }
    });

    it("should handle unknown events gracefully", () => {
      const world = new World(ruleset, "World", {});
      const campaign = new CampaignState({
        id: dangerousGenerateId(),
        roleplayer,
        ruleset,
      });
      const events: RoleplayerEvent[] = [
        {
          type: "Unknown",
          id: dangerousGenerateId(),
        },
      ];

      roleplayer.nextRound();
      roleplayer.publishEvent(campaign.id, ...events);

      const data = roleplayer.getCampaignFromEvents(campaign.id);

      expect(data).toBeDefined();
    });
  });

  describe("Character actions", () => {
    it("should return a list of possible actions based on the character class abilities, spells and inventory", () => {
      const world = new World(ruleset, "World", {});
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

      const char = new Actor({ world });
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
