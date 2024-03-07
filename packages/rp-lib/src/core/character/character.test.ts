import { generateId } from "../../lib/generate-id";
import { Interaction, TargetType } from "../interaction/interaction";
import { Item, ItemSlot, ItemType, Rarity } from "../item/item";
import { Campaign } from "../campaign/campaign";
import { CampaignEvent } from "../campaign/campaign-events";
import { Character, CharacterResourceType } from "./character";
import { World } from "../world/world";

describe("Character", () => {
  describe("Create character events", () => {
    it("should handle create character events", () => {
      const characterA = generateId();
      const characterB = generateId();

      const world = new World({ name: "World", characterResourceTypes: [] });
      const campaign = new Campaign({ name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterA, "Character A");
      campaign.createCharacter(characterB, "Character B");

      const data = campaign.applyEvents();
      expect(data.characters.length).toBe(2);
    });

    it("should apply maximum health change events", () => {
      const characterId = generateId();

      const world = new World({ name: "World" });
      const campaign = new Campaign({ name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterMaximumHealthSet",
          maximumHealth: 12,
          id: generateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.applyEvents();
      const characterFromEvents = data.characters.find(
        (c) => c.id === characterId
      );
      expect(characterFromEvents!.maximumHealth).toBe(12);
    });

    it("should apply movement events", () => {
      const characterId = generateId();
      const movementResource: CharacterResourceType = {
        id: generateId(),
        name: "Movement speed",
      };
      const world = new World({
        name: "World",
        characterResourceTypes: [movementResource],
      });
      const campaign = new Campaign({ name: "Campaign", world });

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceCurrentChange",
          id: generateId(),
          resourceId: movementResource.id,
          amount: 35,
          characterId: characterId,
        },
        {
          type: "CharacterPositionSet",
          id: generateId(),
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
          id: generateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.applyEvents();
      const characterFromEvents = data.characters.find(
        (c) => c.id === characterId
      );
      expect(characterFromEvents!.position.x).toBe(10);
      expect(characterFromEvents!.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds remaining movement", () => {
      const movementResource: CharacterResourceType = {
        id: generateId(),
        name: "Movement speed",
      };

      const world = new World({
        name: "World",
        characterResourceTypes: [movementResource],
      });
      const campaign = new Campaign({ name: "Campaign", world });

      const characterId = generateId();
      const character = new Character(world);
      character.id = characterId;

      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceCurrentChange",
          id: generateId(),
          amount: 35,
          characterId: characterId,
          resourceId: movementResource.id,
        },
        {
          type: "CharacterPositionSet",
          id: generateId(),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: "RoundStarted",
          id: generateId(),
        },
        {
          type: "CharacterMovement",
          targetPosition: {
            x: 10,
            y: 50,
            z: 0,
          },
          id: generateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      expect(campaign.applyEvents).toThrow();
    });

    it("should apply temporary health change events", () => {
      const characterId = generateId();
      const world = new World({ name: "World" });
      const campaign = new Campaign({ name: "Campaign", world });
      campaign.nextRound();
      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterMaximumHealthSet",
          maximumHealth: 12,
          id: generateId(),
          characterId: characterId,
        },
        {
          type: "CharacterHealthSet",
          healthChange: 12,
          id: generateId(),
          characterId: characterId,
        },
        {
          type: "CharacterHealthLoss",
          healthLoss: 4,
          id: generateId(),
          characterId: characterId,
          interactionId: generateId(),
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.applyEvents();
      const characterFromEvents = data.characters.find(
        (c) => c.id === characterId
      );
      expect(characterFromEvents!.currentHealth).toBe(8);
    });

    it("should apply item gain events", () => {
      const characterId = generateId();
      const itemId = generateId();
      const world = new World({
        name: "World",
        items: [
          {
            id: itemId,
            rarity: Rarity.Common,
            actions: [],
            name: "Item",
            occupiesSlots: [ItemSlot.Inventory],
            type: ItemType.Equipment,
            description: "",
            imageUrl: "",
          },
        ],
      });
      const campaign = new Campaign({ name: "Campaign", world });
      campaign.nextRound();

      campaign.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterSpawned",
          id: generateId(),
          characterId: characterId,
        },
        {
          type: "CharacterItemGain",
          id: generateId(),
          characterId: characterId,
          itemId: itemId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      const data = campaign.applyEvents();
      const characterFromEvents = data.characters.find(
        (c) => c.id === characterId
      );
      expect(characterFromEvents!.inventory.length).toBe(1);
    });

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = generateId();
      const world = new World({ name: "World" });
      const campaign = new Campaign({ name: "Campaign", world });
      campaign.nextRound();

      const events: CampaignEvent[] = [
        {
          type: "CharacterMaximumHealthSet",
          maximumHealth: 12,
          id: generateId(),
          characterId: characterId,
        },
      ];

      campaign.publishCampaignEvent(...events);

      try {
        campaign.applyEvents();
      } catch (e) {
        // Success
      }
    });

    it("should handle unhandled events gracefully", () => {
      const world = new World({ name: "World" });
      const campaign = new Campaign({ name: "New campaign", world });
      const events: CampaignEvent[] = [
        {
          type: "Unknown",
          id: generateId(),
        },
      ];

      campaign.nextRound();
      campaign.publishCampaignEvent(...events);

      const data = campaign.applyEvents();

      expect(data).toBeDefined();
    });
  });

  describe("Character actions", () => {
    it("should return a list of possible interactions based on the character class abilities, spells and inventory", () => {
      const sword: Item = {
        id: generateId(),
        rarity: Rarity.Common,
        actions: [
          {
            id: generateId(),
            appliesEffects: [],
            eligibleTargets: [TargetType.Hostile],
            name: "Slash",
            rangeDistanceMeters: 5,
            requiresResources: [],
          },
        ],
        name: "Sword",
        occupiesSlots: [ItemSlot.MainHand],
        type: ItemType.Equipment,
      };

      const healingWord: Interaction = {
        id: generateId(),
        name: "Healing Word (Level 1)",
        appliesEffects: [],
        eligibleTargets: [TargetType.Friendly],
        rangeDistanceMeters: 30,
        requiresResources: [],
      };

      const firebolt: Interaction = {
        id: generateId(),
        appliesEffects: [],
        eligibleTargets: [TargetType.Hostile],
        name: "Firebolt",
        rangeDistanceMeters: 35,
        requiresResources: [
          {
            resourceId: "spell-slot-level-1",
            amount: 1,
          },
        ],
      };

      const world = new World({ name: "World" });
      const char = new Character(world);
      char.equipment = [
        {
          slotId: "main-hand",
          item: sword,
        },
      ];

      char.actions = [healingWord, firebolt];

      const actions = char.getAvailableActions();
      expect(actions.length).toBe(3);
    });
  });
});
