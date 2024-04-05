import { World } from "../..";
import { Id } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { ActionDefinition } from "../action/action";
import { StatusDefinition } from "../action/status";
import { Party } from "../campaign/party";
import { CampaignEvent, CampaignEventWithRound, RoleplayerEvent } from "../events/events";
import { EquipmentSlotDefinition, ItemDefinition, ItemType } from "../inventory/item";
import {
  Alignment,
  CharacterResourceDefinition,
  CharacterStatType,
  Clazz,
  ElementDefinition,
  Race,
} from "../ruleset/ruleset";

/**
 * @module core/actor
 */
export type Position = {
  x: number;
  y: number;
  z: number;
};

/**
 * @module core/actor
 */
export type CharacterResource = {
  resourceTypeId: CharacterResourceDefinition["id"];
  amount: number;
  max: number;
  min: number;
};

/**
 * @module core/actor
 */
export type CharacterResourceGeneration = {
  resourceTypeId: CharacterResourceDefinition["id"];
  amount: number;
};

/**
 * @module core/actor
 */
export type CharacterClass = {
  level: number;
  classId: Clazz["id"];
};

/**
 * @module core/actor
 */
export type CharacterEquipmentSlot = {
  item?: CharacterInventoryItem;
  slotId: EquipmentSlotDefinition["id"];
};

export type CharacterInventoryItem = {
  id: Id;
  definition: ItemDefinition;
};

/**
 * @module core/actor
 */
export type Reaction = {
  id: Id;
  name: string;
  type: ReactionEventType;
  eventType: RoleplayerEvent["type"];
  action: ActionDefinition;
};

/**
 * @module core/actor
 */
export enum ReactionEventType {
  OnHit = "OnHit",
  OnDodge = "OnDodge",
}

/**
 * @module core/actor
 */
export type ReactionResource = {
  reactionId: Reaction["id"];
  targetId: Actor["id"];
};

/**
 * @module core/actor
 */
export type CharacterStat = {
  statId: CharacterStatType["id"];
  amount: number;
};

export function isCharacterEvent(event: CampaignEvent): event is Extract<CampaignEvent, { characterId: Actor["id"] }> {
  return (event as any).characterId !== undefined;
}

/**
 * @module core/actor
 */
export class Actor {
  id!: Id;
  party!: Party["id"];
  exists!: boolean;

  templateCharacterId?: Actor["id"];
  characterType!: "Player" | "NPC" | "Monster";

  xp!: number;
  name!: string;
  race!: Race["id"];
  description?: string;
  alignment!: Alignment;
  classes: CharacterClass[] = [];

  inventory: CharacterInventoryItem[] = [];
  equipment: CharacterEquipmentSlot[] = [];

  stats: CharacterStat[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  position!: Position;

  resources: CharacterResource[] = [];
  reactionsRemaining: ReactionResource[] = [];
  reactions: Reaction[] = [];

  world!: World;

  constructor(a: AugmentedRequired<Partial<Actor>, "world">) {
    Object.assign(this, a);
  }

  resetResources(generation: CharacterResourceGeneration[]) {
    this.resources = this.resources.map((r) => {
      const resourceGeneration = generation.find((g) => g.resourceTypeId === r.resourceTypeId);
      if (!resourceGeneration) {
        return r;
      }

      return {
        ...r,
        amount: Math.min(r.max, r.amount + resourceGeneration.amount),
      };
    });
  }

  action(actionDefinition: ActionDefinition) {
    return {
      rolls: [
        {
          name: "Hit",
          roll: 20,
        },
      ],
    };
  }

  /**
   * Get all available actions for the characters, based on equipment, class, spells, etc.
   * @returns A list of available actions
   */
  getAvailableActions(): ActionDefinition[] {
    const consumables = this.inventory
      .filter((it) => it.definition.type === ItemType.Consumable)
      .flatMap((i) => i.definition.actions);

    const equipmentActions = this.equipment
      .flatMap((eq) => eq.item)
      .filter((i) => i)
      .flatMap((i) => i!.definition.actions);

    return [...this.actions, ...equipmentActions, ...consumables];
  }

  getDamageAmplify(elementType: ElementDefinition) {
    return 1;
  }

  getResistance(element: ElementDefinition, damage: number) {
    return 0;
  }

  tryHit(target: Actor) {
    return true;
  }

  applyEvent(event: CampaignEventWithRound) {
    switch (event.type) {
      case "CharacterExperienceChanged": {
        this.xp += event.experience;
        break;
      }

      case "CharacterExperienceSet": {
        this.xp = event.experience;
        break;
      }

      case "CharacterResourceMaxSet": {
        const resource = this.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          this.resources.push({
            amount: 0,
            max: event.max,
            min: 0,
            resourceTypeId: event.resourceTypeId,
          });
          break;
        }

        resource.max = event.max;
        break;
      }

      case "CharacterResourceGain": {
        const resource = this.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find resource ${event.resourceTypeId}`);
        }

        resource.amount += event.amount;
        break;
      }

      case "CharacterResourceLoss": {
        const resource = this.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find resource ${event.resourceTypeId}`);
        }

        resource.amount -= event.amount;
        break;
      }

      case "CharacterNameSet": {
        this.name = event.name;
        break;
      }

      case "CharacterStatChange": {
        const stat = this.stats.find((s) => s.statId === event.statId);

        if (!stat) {
          this.stats.push({ statId: event.statId, amount: event.amount });
          break;
        }

        stat.amount = event.amount;
        break;
      }

      case "CharacterPositionSet": {
        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterPositionSet");
        }

        this.position = event.targetPosition;
        break;
      }

      case "CharacterAttackAttackerHit": {
        break;
      }

      case "CharacterAttackAttackerMiss": {
        break;
      }

      case "CharacterAttackDefenderHit": {
        break;
      }

      case "CharacterAttackDefenderDodge": {
        const availableReactions = this.reactions.filter((r) => r.eventType === "CharacterAttackDefenderDodge");

        const reactionResources = availableReactions.map((r) => ({
          reactionId: r.id,
          targetId: event.attackerId,
        }));

        this.reactionsRemaining.push(...reactionResources);
        break;
      }

      case "CharacterAttackDefenderParry": {
        break;
      }

      case "CharacterClassReset": {
        this.classes = [];
        break;
      }

      case "CharacterClassLevelGain": {
        const characterClassLevels = this.classes.length;
        const characterLevel = 0; // TODO: Fix this, should be calculated from experience

        if (characterClassLevels >= characterLevel) {
          throw new Error("Cannot add class levels to character, character level not high enough");
        }

        const clazz = this.world!.classes.find((c) => c.id === event.classId);
        if (!clazz) {
          throw new Error("Class not found");
        }

        const characterClass = this.classes.find((c) => c.classId === event.classId);

        if (!characterClass) {
          this.classes.push({ classId: event.classId, level: 1 });
          break;
        }

        characterClass.level = characterClass.level + 1;
        break;
      }

      case "CharacterStatusGain": {
        const status = this.world!.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(`Could not find status with id ${event.statusId} for CharacterStatusGain`);
        }

        this.statuses.push(status);
        break;
      }

      case "CharacterInventoryItemLoss": {
        // Remove equipped item if it was equipped
        this.equipment = this.equipment.map((eq) => {
          const equipped = eq.item!.id === event.characterInventoryItemId;
          if (equipped) {
            eq.item = undefined;
          }

          return eq;
        });

        // Remove from inventory
        this.inventory = this.inventory.filter((eq) => eq.id === event.characterInventoryItemId);

        break;
      }

      case "CharacterInventoryItemGain": {
        const item = this.world!.itemTemplates.find((eq) => eq.id === event.itemDefinitionId);
        if (!item) {
          throw new Error(`Could not find item with id ${event.itemDefinitionId} for CharacterGainItem`);
        }

        this.inventory.push({ id: event.itemInstanceId, definition: item });
        break;
      }

      case "CharacterEquipmentSlotGain": {
        const characterSlot = this.world!.ruleset.getCharacterEquipmentSlots().find(
          (slot) => slot.id === event.equipmentSlotId
        );

        if (!characterSlot) {
          throw new Error("Cannot find slot");
        }

        const existing = this.equipment.find((eq) => eq.slotId === event.equipmentSlotId);

        if (existing) {
          throw new Error("Character already have equipment slot");
        }

        this.equipment.push({ slotId: characterSlot.id, item: undefined });

        break;
      }

      case "CharacterInventoryItemEquip": {
        const characterHasItem = this.inventory.find((eq) => eq.id === event.itemId);
        if (!characterHasItem) {
          throw new Error(`Could not find item on character`);
        }

        const slot = this.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        if (slot.item) {
          throw new Error("Slot already has item");
        }

        slot.item = characterHasItem;

        break;
      }

      case "CharacterInventoryItemUnEquip": {
        const slot = this.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = undefined;

        break;
      }

      case "CharacterMovement": {
        const resourceType = this.world!.ruleset.getCharacterResourceTypes().find((r) => r.name === "Movement speed");

        if (!resourceType) {
          throw new Error("Movement resource not defined in world");
        }

        const characterMovementResource = this.resources.find((r) => r.resourceTypeId === resourceType.id);

        if (!characterMovementResource) {
          throw new Error("Character does not have a defined movement speed resource");
        }

        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = this.position.x + event.targetPosition.x;
        const distanceY = this.position.y + event.targetPosition.y;
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        if (distance > characterMovementResource.amount) {
          throw new Error("Movement exceeds remaining speed for CharacterMovement");
        }

        characterMovementResource.amount -= distance;
        this.position.x = event.targetPosition.x;
        this.position.y = event.targetPosition.y;
        break;
      }

      case "CharacterActionGain": {
        const action = this.world!.actions.find((a) => a.id === event.actionId);
        if (!action) {
          throw new Error(`Unknown action ${event.actionId}`);
        }
        this.actions.push(action);
        return;
      }

      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  }
}
