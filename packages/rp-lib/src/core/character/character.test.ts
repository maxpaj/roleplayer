import { generateId } from "../../lib/generate-id";
import { Interaction, TargetType } from "../interaction/interaction";
import { Item, ItemSlot, ItemType, Rarity } from "../item/item";
import { World } from "../world/world";
import { WorldEvent } from "../world/world-events";
import { Character, CharacterResourceType } from "./character";

describe("Character", () => {
  describe("Create character events", () => {
    it("should handle create character events", () => {
      const characterA = generateId();
      const characterB = generateId();

      const world = new World({ name: "World" });

      world.nextRound();
      world.createCharacter(characterA, "Character A");
      world.createCharacter(characterB, "Character B");

      const data = world.applyEvents();
      expect(data.characters.length).toBe(2);
    });

    it("should apply maximum health change events", () => {
      const characterId = generateId();
      const world = new World({ name: "World" });

      world.nextRound();
      world.createCharacter(characterId, "Character");

      const events: WorldEvent[] = [
        {
          type: "CharacterMaximumHealthSet",
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
      const movementResource: CharacterResourceType = {
        id: generateId(),
        name: "Movement speed",
      };

      world.characterResourceTypes = [movementResource];
      world.nextRound();
      world.createCharacter(characterId, "Character");

      const events: WorldEvent[] = [
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

      world.publishWorldEvent(...events);

      const data = world.applyEvents();
      const characterFromEvents = data.characters.find(
        (c) => c.id === characterId
      );
      expect(characterFromEvents!.position.x).toBe(10);
      expect(characterFromEvents!.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds remaining movement", () => {
      const world = new World({ name: "World" });
      const movementResource: CharacterResourceType = {
        id: generateId(),
        name: "Movement speed",
      };

      const characterId = generateId();
      const character = new Character(world);
      character.id = characterId;

      world.characterResourceTypes = [movementResource];
      world.nextRound();
      world.createCharacter(characterId, "Character");

      const events: WorldEvent[] = [
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

      world.publishWorldEvent(...events);

      expect(world.applyEvents).toThrow();
    });

    it("should apply temporary health change events", () => {
      const characterId = generateId();
      const world = new World({ name: "World" });
      world.nextRound();
      world.createCharacter(characterId, "Character");

      const events: WorldEvent[] = [
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
      world.nextRound();
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
      world.nextRound();

      const events: WorldEvent[] = [
        {
          type: "CharacterMaximumHealthSet",
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

      world.nextRound();
      world.publishWorldEvent(...events);

      const data = world.applyEvents();

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

      const char = new Character(new World({ name: "World" }));
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
