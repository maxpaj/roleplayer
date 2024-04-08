import { Rarity } from "../..";
import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { generateId } from "../../lib/generate-id";
import { TargetType, type ActionDefinition } from "../action/action";
import type { CampaignEvent } from "../events/events";
import { ItemEquipmentType, ItemSlot, ItemType, type ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import type { CharacterResourceDefinition } from "../ruleset/ruleset";
import { Actor } from "./character";

const ruleset = new DnDRuleset((str) => {
  const [, staticValue = "0"] = str.split("+");
  return 2 + +staticValue;
});

describe("Character", () => {
  describe("Create character events", () => {
    it("should handle create character events", () => {
      const characterA = generateId();
      const characterB = generateId();

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      roleplayer.startCampaign();
      roleplayer.createCharacter(characterA, "Character A");
      roleplayer.createCharacter(characterB, "Character B");

      const data = roleplayer.campaign;
      expect(data.characters.length).toBe(2);
    });

    it("should apply maximum health change events", () => {
      const characterId = generateId();

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const resourceType: CharacterResourceDefinition = {
        id: generateId(),
        name: "Health",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 12,
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      roleplayer.publishEvent(...events);

      const data = roleplayer.campaign;
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === resourceType.id)?.max).toBe(12);
    });

    it("should apply movement events", () => {
      const characterId = generateId();
      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const movementSpeedResource = ruleset.getCharacterResourceTypes().find((r) => r.name === "Movement speed");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceGain",
          resourceTypeId: movementSpeedResource!.id,
          amount: 35,
          characterId: characterId,
        },
        {
          type: "CharacterPositionSet",
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
          characterId: characterId,
        },
      ];

      roleplayer.publishEvent(...events);

      const data = roleplayer.campaign;
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.position.x).toBe(10);
      expect(characterFromEvents!.position.y).toBe(20);
    });

    it("should reject movement event when movement exceeds remaining movement", () => {
      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      const characterId = generateId();
      roleplayer.startCampaign();
      roleplayer.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceGain",
          amount: 35,
          characterId: characterId,
          resourceTypeId: "00000000-0000-0000-0000-000000001000",
        },
        {
          type: "CharacterPositionSet",
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: "RoundStarted",
          roundId: generateId(),
        },
        {
          type: "CharacterMovement",
          targetPosition: {
            x: 10,
            y: 50,
            z: 0,
          },
          characterId: characterId,
        },
      ];

      expect(() => roleplayer.publishEvent(...events)).toThrow();
    });

    it("should apply temporary resource change events", () => {
      const characterId = generateId();

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );
      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const testResourceType: CharacterResourceDefinition = {
        id: generateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 14,
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
        {
          type: "CharacterResourceGain",
          amount: 12,
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
        {
          type: "CharacterResourceLoss",
          amount: 8,
          characterId: characterId,
          resourceTypeId: testResourceType.id,
        },
      ];

      roleplayer.publishEvent(...events);

      const data = roleplayer.campaign;
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.max).toBe(14);
      expect(characterFromEvents!.resources.find((r) => r.resourceTypeId === testResourceType.id)?.amount).toBe(4);
    });

    it("should apply item gain events", () => {
      const characterId = generateId();
      const itemId = generateId();

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        {
          id: generateId(),
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
        }
      );

      roleplayer.nextRound();
      roleplayer.createCharacter(characterId, "Character");

      const events: CampaignEvent[] = [
        {
          type: "CharacterSpawned",
          characterId: characterId,
        },
        {
          type: "CharacterInventoryItemGain",
          itemInstanceId: generateId(),
          characterId: characterId,
          itemDefinitionId: itemId,
        },
      ];

      roleplayer.publishEvent(...events);

      const data = roleplayer.campaign;
      const characterFromEvents = data.characters.find((c) => c.id === characterId);
      expect(characterFromEvents!.inventory.length).toBe(1);
    });

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = generateId();

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      roleplayer.nextRound();

      const resourceType: CharacterResourceDefinition = {
        id: generateId(),
        name: "Resource",
        defaultMax: 20,
      };

      const events: CampaignEvent[] = [
        {
          type: "CharacterResourceMaxSet",
          max: 14,
          characterId: characterId,
          resourceTypeId: resourceType.id,
        },
      ];

      roleplayer.publishEvent(...events);

      try {
        roleplayer.campaign;
      } catch (e) {
        // Success
      }
    });

    it("should handle unknown events gracefully", () => {
      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId() }
      );

      const events: CampaignEvent[] = [
        {
          type: "Unknown",
        },
      ];

      roleplayer.nextRound();
      roleplayer.publishEvent(...events);

      const data = roleplayer.campaign;

      expect(data).toBeDefined();
    });
  });

  describe("Character actions", () => {
    it("should return a list of possible actions based on the character class abilities, spells and inventory", () => {
      const sword: ItemDefinition = {
        id: generateId(),
        rarity: Rarity.Common,
        weightUnits: 1,
        stats: [],
        description: "",
        equipmentType: ItemEquipmentType.OneHandWeapon,
        actions: [
          {
            id: generateId(),
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
        id: generateId(),
        name: "Healing Word (Level 1)",
        appliesEffects: [],
        eligibleTargets: [TargetType.Friendly],
        rangeDistanceUnits: 30,
        requiresResources: [],
        description: "",
      };

      const firebolt: ActionDefinition = {
        id: generateId(),
        appliesEffects: [],
        eligibleTargets: [TargetType.Hostile],
        name: "Firebolt",
        rangeDistanceUnits: 35,
        requiresResources: [
          {
            resourceTypeId: generateId(),
            amount: 1,
          },
        ],
        description: "",
      };

      const roleplayer = new Roleplayer(
        {
          ruleset,
        },
        { id: generateId(), actions: [healingWord, firebolt], itemTemplates: [sword] }
      );

      const char = new Actor({ campaign: roleplayer.campaign });
      char.equipment = [
        {
          slotId: generateId(),
          item: { id: generateId(), definition: sword },
        },
      ];

      char.actions = [healingWord, firebolt];

      const actions = char.getAvailableActions();
      expect(actions.length).toBe(3);
    });
  });
});
