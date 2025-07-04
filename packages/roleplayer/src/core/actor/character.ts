import type { CampaignState, Resource, ResourceGeneration } from "../..";
import type { Id } from "../../lib/generate-id";
import { OmitFunctions } from "../../types/remove-functions";
import type { WithRequired } from "../../types/with-required";
import type { ActionDefinition } from "../action/action";
import type { StatusDefinition } from "../action/status";
import type { Party } from "../campaign/party";
import { CharacterEventTypes, type RoleplayerEvent } from "../events/events";
import { ItemType, type EquipmentSlotDefinition, type ItemDefinition } from "../inventory/item";
import type { Alignment, CharacterStatType, Clazz, ElementDefinition, Race } from "../ruleset/ruleset";
import { MovementSpeedResourceTypeName } from "../world/resource";

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
 *
 * Character attributes represents numerically measurable qualities of a character are persistent over time, for example between battles. Stuff like strength, agility, etc.
 *
 * For expendable/regenerative attributes, see character resources.
 */
export type CharacterAttribute = {
  statId: CharacterStatType["id"];
  amount: number;
};

export function isCharacterEvent(
  event: RoleplayerEvent
): event is Extract<RoleplayerEvent, { characterId: Actor["id"] }> {
  return (event as any).characterId !== undefined;
}

/**
 * Actor template type, inherited from Actor, with campaign being a required property and all methods stripped.
 */
export type ActorTemplate = OmitFunctions<Required<Omit<ConstructorParameters<typeof Actor>[0], "campaign">>>;

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

  stats: CharacterAttribute[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  position!: Position;

  resources: Resource[] = [];
  reactionsRemaining: ReactionResource[] = [];
  reactions: Reaction[] = [];

  campaign!: CampaignState;

  unsubscribe: (() => void) | undefined;

  constructor(a: WithRequired<Partial<Actor>, "campaign">) {
    Object.assign(this, a);
    this.unsubscribe = a.campaign.roleplayer.subscribe(this.reduce.bind(this));
  }

  resetResources(generation: ResourceGeneration[]) {
    this.resources = this.resources.map((resource) => {
      const resourceGeneration = generation.find((g) => g.resourceTypeId === resource.resourceTypeId);
      if (!resourceGeneration) {
        return resource;
      }

      return {
        ...resource,
        amount: Math.min(resource.max, resource.amount + resourceGeneration.amount),
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

  reduce(event: RoleplayerEvent) {
    if (!("characterId" in event) || event.characterId !== this.id) return;

    switch (event.type) {
      case CharacterEventTypes.CharacterExperienceChanged: {
        this.xp += event.experience;
        break;
      }

      case CharacterEventTypes.CharacterExperienceSet: {
        this.xp = event.experience;
        break;
      }

      case CharacterEventTypes.CharacterResourceMaxSet: {
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

      case CharacterEventTypes.CharacterResourceGain: {
        const resource = this.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find character resource type ${event.resourceTypeId}`);
        }

        resource.amount += event.amount;
        break;
      }

      case CharacterEventTypes.CharacterResourceLoss: {
        const resource = this.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find character resource type ${event.resourceTypeId}`);
        }

        resource.amount -= event.amount;
        break;
      }

      case CharacterEventTypes.CharacterNameSet: {
        this.name = event.name;
        break;
      }

      case CharacterEventTypes.CharacterStatChange: {
        const stat = this.stats.find((s) => s.statId === event.statId);

        if (!stat) {
          this.stats.push({ statId: event.statId, amount: event.amount });
          break;
        }

        stat.amount = event.amount;
        break;
      }

      case CharacterEventTypes.CharacterPositionSet: {
        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterPositionSet");
        }

        this.position = event.targetPosition;
        break;
      }

      case CharacterEventTypes.CharacterAttackAttackerHit: {
        break;
      }

      case CharacterEventTypes.CharacterAttackAttackerMiss: {
        break;
      }

      case CharacterEventTypes.CharacterAttackDefenderHit: {
        break;
      }

      case CharacterEventTypes.CharacterAttackDefenderDodge: {
        const availableReactions = this.reactions.filter((r) => r.eventType === "CharacterAttackDefenderDodge");

        const reactionResources = availableReactions.map((r) => ({
          reactionId: r.id,
          targetId: event.attackerId,
        }));

        this.reactionsRemaining.push(...reactionResources);
        break;
      }

      case CharacterEventTypes.CharacterAttackDefenderParry: {
        break;
      }

      case CharacterEventTypes.CharacterClassReset: {
        this.classes = [];
        break;
      }

      case CharacterEventTypes.CharacterClassLevelGain: {
        const characterClassLevels = this.classes.length;
        const characterLevel = 0; // TODO: Fix this, should be calculated from experience

        if (characterClassLevels >= characterLevel) {
          throw new Error("Cannot add class levels to character, character level not high enough");
        }

        const clazz = this.campaign.classes.find((c) => c.id === event.classId);
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

      case CharacterEventTypes.CharacterStatusGain: {
        const status = this.campaign.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(`Could not find status with id ${event.statusId} for CharacterStatusGain`);
        }

        this.statuses.push(status);
        break;
      }

      case CharacterEventTypes.CharacterInventoryItemLoss: {
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

      case CharacterEventTypes.CharacterInventoryItemGain: {
        const item = this.campaign.itemTemplates.find((eq) => eq.id === event.itemDefinitionId);
        if (!item) {
          throw new Error(`Could not find item with id ${event.itemDefinitionId} for CharacterGainItem`);
        }

        this.inventory.push({ id: event.itemInstanceId, definition: item });
        break;
      }

      case CharacterEventTypes.CharacterEquipmentSlotGain: {
        const characterSlot = this.campaign.ruleset
          .getCharacterEquipmentSlots()
          .find((slot) => slot.id === event.equipmentSlotId);

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

      case CharacterEventTypes.CharacterInventoryItemEquip: {
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

      case CharacterEventTypes.CharacterInventoryItemUnEquip: {
        const slot = this.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = undefined;

        break;
      }

      case CharacterEventTypes.CharacterMovement: {
        const resourceType = this.campaign.ruleset
          .getCharacterResourceTypes()
          .find((r) => r.name === MovementSpeedResourceTypeName);

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

      case CharacterEventTypes.CharacterActionGain: {
        const action = this.campaign.actions.find((a) => a.id === event.actionId);
        if (!action) {
          throw new Error(`Unknown action ${event.actionId}`);
        }
        this.actions.push(action);
        return;
      }
    }
  }

  dispose() {
    this.unsubscribe?.();
  }
}
