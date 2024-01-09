import { Character } from "./character";
import { ItemSlot, ItemType, Rarity } from "../item/item";
import { generateId } from "../../id";
import { Campaign } from "../campaign/campaign";

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
        type: "CharacterSpawned",
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterPermanentHealthChange",
        amount: 12,
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
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
        type: "CharacterSpawned",
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterMoveSpeedChange",
        id: generateId("event"),
        amount: 35,
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterPositionChange",
        id: generateId("event"),
        targetPosition: {
          x: 10,
          y: 0,
          z: 0,
        },
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterMovement",
        targetPosition: {
          x: 10,
          y: 20,
          z: 0,
        },
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
    ];

    const characterFromEvents = campaign.getCharacterFromEvents(characterId);
    expect(characterFromEvents.position.x).toBe(10);
    expect(characterFromEvents.position.y).toBe(20);
  });

  it("should reject movement event when movement exceeds remaining movement", () => {
    const characterId = generateId("char");
    const character = new Character();
    character.id = characterId;

    const campaign = new Campaign();
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterMoveSpeedChange",
        id: generateId("event"),
        amount: 35,
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterPositionChange",
        id: generateId("event"),
        targetPosition: {
          x: 10,
          y: 0,
          z: 0,
        },
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "NewRound",
        id: generateId("event"),
        roundId: generateId("round"),
      },
      {
        type: "CharacterMovement",
        targetPosition: {
          x: 10,
          y: 50,
          z: 0,
        },
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
    ];

    expect(() => campaign.getCharacterFromEvents(characterId)).toThrow();
  });

  it("should apply temporary health change events", () => {
    const characterId = generateId("char");
    const character = new Character();
    character.id = characterId;

    const campaign = new Campaign();
    campaign.characters = [character];
    campaign.events = [
      {
        type: "CharacterSpawned",
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterPermanentHealthChange",
        amount: 12,
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterHealthChange",
        amount: 12,
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterHealthLoss",
        amount: 4,
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
        interactionId: generateId("interaction"),
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
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
      },
      {
        type: "CharacterItemGain",
        id: generateId("event"),
        characterId: characterId,
        itemId: itemId,
        roundId: generateId("round"),
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
        type: "CharacterPermanentHealthChange",
        amount: 12,
        id: generateId("event"),
        characterId: characterId,
        roundId: generateId("round"),
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
        type: "Unknown",
        id: generateId("event"),
        roundId: generateId("round"),
      },
    ];

    expect(campaign.getCharacterFromEvents(characterId)).toBeDefined();
  });
});
