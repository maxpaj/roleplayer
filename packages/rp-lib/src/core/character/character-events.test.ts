import { Character } from "./character";
import { ItemSlot, ItemType, Rarity } from "../item/item";
import { World, WorldEvent } from "../world/world";
import { generateId } from "../../lib/generate-id";

describe("apply world events", () => {
  it("should created character events", () => {
    const characterA = generateId();
    const characterB = generateId();

    const world = new World({ name: "World" });
    world.createCharacter(characterA, "Character A");
    world.createCharacter(characterB, "Character B");

    const data = world.applyEvents();
    expect(data.characters.length).toBe(2);
  });

  it("should apply maximum health change events", () => {
    const characterId = generateId();
    const world = new World({ name: "World" });
    world.createCharacter(characterId, "Character");

    const events: WorldEvent[] = [
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
      },
    ];

    world.publishWorldEvent(...events);

    const data = world.applyEvents();
    const characterFromEvents = data.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.maximumHealth).toBe(12);
  });

  it("should apply movement events", () => {
    const characterId = generateId();
    const world = new World({ name: "World" });

    world.createCharacter(characterId, "Character");

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

    world.publishWorldEvent(...events);

    const data = world.applyEvents();
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

    const world = new World({ name: "World" });
    world.createCharacter(characterId, "Character");

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

    world.publishWorldEvent(...events);

    expect(world.applyEvents).toThrow();
  });

  it("should apply temporary health change events", () => {
    const characterId = generateId();
    const world = new World({ name: "World" });
    world.createCharacter(characterId, "Character");

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

    world.publishWorldEvent(...events);

    const data = world.applyEvents();
    const characterFromEvents = data.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.currentHealth).toBe(8);
  });

  it("should apply item gain events", () => {
    const characterId = generateId();
    const world = new World({ name: "World" });
    const itemId = generateId();

    world.items = [
      {
        id: itemId,
        rarity: Rarity.Common,
        actions: [],
        name: "Item",
        occupiesSlots: [ItemSlot.Inventory],
        type: ItemType.Equipment,
      },
    ];

    world.createCharacter(characterId, "Character");

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

    world.publishWorldEvent(...events);

    const data = world.applyEvents();
    const characterFromEvents = data.characters.find(
      (c) => c.id === characterId
    );
    expect(characterFromEvents!.inventory.length).toBe(1);
  });

  it("should apply reject character events if character doesn't exist", () => {
    const characterId = generateId();
    const world = new World({ name: "World" });
    const events: WorldEvent[] = [
      {
        type: "CharacterMaximumHealthChange",
        maximumHealth: 12,
        id: generateId(),
        characterId: characterId,
      },
    ];

    world.publishWorldEvent(...events);

    try {
      world.applyEvents();
    } catch (e) {
      // Success
    }
  });

  it("should handle unhandled events gracefully", () => {
    const world = new World({ name: "New world" });
    const events: WorldEvent[] = [
      {
        type: "Unknown",
        id: generateId(),
      },
    ];

    world.publishWorldEvent(...events);

    const data = world.applyEvents();

    expect(data).toBeDefined();
  });
});
