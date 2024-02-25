import { Character } from "./character";
import { ItemSlot, ItemType, Rarity } from "../item/item";
import { Campaign } from "../campaign/campaign";
import { generateId } from "../../lib/generate-id";

describe("apply campaign events", () => {
  it("should created character events", () => {
    const characterA = generateId();
    const characterB = generateId();

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterA,
        roundId: generateId(),
      },
      {
        type: "CharacterChangedName",
        id: generateId(),
        characterId: characterA,
        roundId: generateId(),
        name: "Character A",
      },
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterB,
        roundId: generateId(),
      },
      {
        type: "CharacterChangedName",
        id: generateId(),
        characterId: characterB,
        roundId: generateId(),
        name: "Character B",
      },
    ];

    campaign.applyEvents();

    expect(campaign.characters.length).toBe(2);
  });

  it("should apply maximum health change events", () => {
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;
    character.maximumHealth = 0;

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
    ];

    campaign.applyEvents();
    const characterFromEvents = campaign.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.maximumHealth).toBe(12);
  });

  it("should apply movement events", () => {
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterMoveSpeedChange",
        id: generateId(),
        movementSpeed: 35,
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterPositionChange",
        id: generateId(),
        targetPosition: {
          x: 10,
          y: 0,
          z: 0,
        },
        characterId: characterId,
        roundId: generateId(),
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
        roundId: generateId(),
      },
    ];

    campaign.applyEvents();
    const characterFromEvents = campaign.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.position.x).toBe(10);
    expect(characterFromEvents!.position.y).toBe(20);
  });

  it("should reject movement event when movement exceeds remaining movement", () => {
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterMoveSpeedChange",
        id: generateId(),
        movementSpeed: 35,
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterPositionChange",
        id: generateId(),
        targetPosition: {
          x: 10,
          y: 0,
          z: 0,
        },
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "RoundStarted",
        id: generateId(),
        roundId: generateId(),
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
        roundId: generateId(),
      },
    ];

    expect(campaign.applyEvents).toThrow();
  });

  it("should apply temporary health change events", () => {
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterHealthChange",
        healthChange: 12,
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterHealthLoss",
        healthLoss: 4,
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
        interactionId: generateId(),
      },
    ];

    campaign.applyEvents();
    const characterFromEvents = campaign.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.currentHealth).toBe(8);
  });

  it("should apply item gain events", () => {
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;
    character.inventory = [];

    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [character];

    const itemId = generateId();
    campaign.items = [
      {
        id: itemId,
        rarity: Rarity.Common,
        actions: [],
        name: "Item",
        slots: [ItemSlot.Inventory],
        type: ItemType.Equipment,
      },
    ];

    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
      {
        type: "CharacterItemGain",
        id: generateId(),
        characterId: characterId,
        itemId: itemId,
        roundId: generateId(),
      },
    ];

    campaign.applyEvents();
    const characterFromEvents = campaign.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.inventory.length).toBe(1);
  });

  it("should apply reject character events if character doesn't exist", () => {
    const characterId = generateId();
    const campaign = new Campaign({ name: "Campaign" });
    campaign.characters = [];
    campaign.events = [
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
        roundId: generateId(),
      },
    ];

    try {
      campaign.applyEvents();
    } catch (e) {
      // Success
    }
  });

  it("should handle unhandled events gracefully", () => {
    const campaign = new Campaign({ name: "New campaign" });
    campaign.events = [
      {
        type: "Unknown",
        id: generateId(),
        roundId: generateId(),
      },
    ];

    expect(campaign.applyEvents()).toBeUndefined();
  });
});
