import { Character } from "./character";
import { ItemSlot, ItemType, Rarity } from "../item/item";
import { World, WorldEvent } from "../world/world";
import { generateId } from "../../lib/generate-id";

describe("apply campaign events", () => {
  it("should created character events", () => {
    const characterA = generateId();
    const characterB = generateId();

    const campaign = new World({ name: "Campaign" });
    campaign.createCharacter(characterA, "Character A");
    campaign.createCharacter(characterB, "Character B");

    const data = campaign.applyEvents();
    expect(data.characters.length).toBe(2);
  });

  it("should apply maximum health change events", () => {
    const characterId = generateId();
    const campaign = new World({ name: "Campaign" });
    campaign.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
      {
        type: "CharacterMaximumHealthChange",
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
    const campaign = new World({ name: "Campaign" });

    campaign.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
      {
        type: "CharacterMoveSpeedChange",
        id: generateId(),
        movementSpeed: 35,
        characterId: characterId,
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
    const characterId = generateId();
    const character = new Character();
    character.id = characterId;

    const campaign = new World({ name: "Campaign" });
    campaign.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
      {
        type: "CharacterMoveSpeedChange",
        id: generateId(),
        movementSpeed: 35,
        characterId: characterId,
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
    const campaign = new World({ name: "Campaign" });
    campaign.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
      },
      {
        type: "CharacterHealthChange",
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
    const campaign = new World({ name: "Campaign" });
    const itemId = generateId();

    campaign.items = [
      {
        id: itemId,
        rarity: Rarity.Common,
        occupiesSlots: [],
        actions: [],
        name: "Item",
        eligibleSlots: [ItemSlot.Inventory],
        type: ItemType.Equipment,
      },
    ];

    campaign.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
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
    const campaign = new World({ name: "Campaign" });
    const events: WorldEvent[] = [
      {
        type: "CharacterMaximumHealthChange",
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
    const campaign = new World({ name: "New campaign" });
    const events: WorldEvent[] = [
      {
        type: "Unknown",
        id: generateId(),
      },
    ];

    campaign.publishCampaignEvent(...events);

    const data = campaign.applyEvents();

    expect(data).toBeDefined();
  });
});
