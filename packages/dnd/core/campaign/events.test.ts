import assert from "assert";
import { ActionType, Character } from "../character/character";
import { generateId } from "../id";
import { ItemSlot, ItemType } from "../item/item";
import { Campaign, CampaignEventType } from "./campaign";

describe("campaign-events", () => {
  describe("getCharacterFromEvents", () => {
    it("should apply permanent health change events", () => {
      const characterId = generateId("char");
      const character = new Character();
      character.id = characterId;
      character.maximumHealth = 0;

      const campaign = new Campaign();
      campaign.characters = [character];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterSpawned,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterPermanentHealthChange,
          amount: 12,
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      const characterFromEvents = campaign.getCharacterFromEvents(characterId);
      expect(characterFromEvents.maximumHealth).toBe(12);
    });

    it("should apply movement events", () => {
      const characterId = generateId("char");
      const character = new Character();
      character.id = characterId;

      const campaign = new Campaign();
      campaign.characters = [character];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterSpawned,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterMoveSpeedChange,
          id: generateId("event"),
          amount: 35,
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterPositionChange,
          id: generateId("event"),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterMovement,
          targetPosition: {
            x: 10,
            y: 20,
            z: 0,
          },
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      const characterFromEvents = campaign.getCharacterFromEvents(characterId);
      expect(characterFromEvents.position.x).toBe(10);
      expect(characterFromEvents.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds movement speed", () => {
      const characterId = generateId("char");
      const character = new Character();
      character.id = characterId;

      const campaign = new Campaign();
      campaign.characters = [character];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterSpawned,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterMoveSpeedChange,
          id: generateId("event"),
          amount: 35,
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterPositionChange,
          id: generateId("event"),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterMovement,
          targetPosition: {
            x: 10,
            y: 50,
            z: 0,
          },
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      try {
        campaign.getCharacterFromEvents(characterId);
        assert.fail();
      } catch (e) {
        // Success
      }
    });

    it("should apply temporary health change events", () => {
      const characterId = generateId("char");
      const character = new Character();
      character.id = characterId;

      const campaign = new Campaign();
      campaign.characters = [character];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterSpawned,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterPermanentHealthChange,
          amount: 12,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterHealthChangeAbsolute,
          amount: 12,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterHealthChangeRelative,
          amount: -4,
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      const characterFromEvents = campaign.getCharacterFromEvents(characterId);
      expect(characterFromEvents.currentHealth).toBe(8);
    });

    it("should apply item gain events", () => {
      const characterId = generateId("char");
      const character = new Character();
      character.id = characterId;
      character.inventory = [];

      const campaign = new Campaign();
      campaign.characters = [character];

      const itemId = generateId("item");
      campaign.items = [
        {
          id: itemId,
          actions: [],
          name: "Item",
          slots: [ItemSlot.Inventory],
          type: ItemType.Equipment,
        },
      ];

      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterSpawned,
          id: generateId("event"),
          characterId: characterId,
        },
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterGainItem,
          id: generateId("event"),
          characterId: characterId,
          itemId: itemId,
        },
      ];

      const characterFromEvents = campaign.getCharacterFromEvents(characterId);
      expect(characterFromEvents.inventory.length).toBe(1);
    });

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = generateId("char");
      const campaign = new Campaign();
      campaign.characters = [];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.CharacterPermanentHealthChange,
          amount: 12,
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      try {
        campaign.getCharacterFromEvents(characterId);
      } catch (e) {
        // Success
      }
    });

    it("should handle unhandled events gracefully", () => {
      const characterId = generateId("char");
      const campaign = new Campaign();
      campaign.characters = [];
      campaign.events = [
        {
          actionType: ActionType.None,
          eventType: CampaignEventType.Unknown,
          id: generateId("event"),
          characterId: characterId,
        },
      ];

      try {
        campaign.getCharacterFromEvents(characterId);
      } catch (e) {
        // Success
      }
    });
  });
});
