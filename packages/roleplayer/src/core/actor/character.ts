import { Id } from "../../lib/generate-id";
import { CampaignEvent, RoleplayerEvent } from "../events/events";
import { ActionDefinition } from "../action/action";
import { StatusDefinition } from "../action/status";
import { EquipmentSlotDefinition, ItemDefinition, ItemType } from "../inventory/item";
import { Party } from "../campaign/party";
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

  constructor(init?: Partial<Actor>) {
    Object.assign(this, init);
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
}
