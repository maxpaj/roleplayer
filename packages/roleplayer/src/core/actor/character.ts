import { Id } from "../../lib/generate-id";
import { CampaignEvent, RoleplayerEvent, CampaignEventWithRound } from "../events/events";
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
  Ruleset,
} from "../ruleset/ruleset";

/**
 * @module core/actor
 */
export enum ActorType {
  Monster = "Monster",
  Character = "Character",
  World = "World",
}

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
export type CharacterResourceGeneration = CharacterResource & {
  onEvent: RoleplayerEvent;
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

  type!: "Player" | "NPC" | "Monster";

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

  ruleset: Ruleset;

  constructor(ruleset: Ruleset, init?: Partial<Actor>) {
    Object.assign(this, init);
    this.ruleset = ruleset;
  }

  getEligibleTargets(action: ActionDefinition): Actor[] {
    throw new Error("Method not implemented.");
  }

  performAction(): CampaignEventWithRound[] {
    throw new Error("Method not implemented.");
  }

  getActions(): ActionDefinition[] {
    return this.actions;
  }

  getAbilityModifier() {
    return 0;
  }

  getResourceGeneration(): CharacterResourceGeneration[] {
    return this.ruleset.characterResourceGeneration(this);
  }

  resetResources() {
    this.resources = this.resources.map((r) => ({ ...r, amount: r.max }));
  }

  getBattleActionOrder() {
    return this.ruleset.characterBattleActionOrder(this);
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

  getStats() {
    return this.stats;
  }

  getResistanceMultiplier(damageType: ElementDefinition) {
    return this.ruleset.characterResistanceMultiplier(this, damageType);
  }

  getResistanceAbsolute(damageType: ElementDefinition) {
    return this.ruleset.characterResistanceAbsolute(this, damageType);
  }

  /**
   * Get all available actions for the characters, based on equipment, class, spells, etc.
   * @returns A list of available actions
   */
  getAvailableActions(): ActionDefinition[] {
    const consumables = this.inventory.filter((it) => it.definition.type === ItemType.Consumable);

    return [
      ...this.actions,
      ...this.equipment
        .flatMap((eq) => eq.item)
        .filter((i) => i)
        .flatMap((i) => i!.definition.actions),
      ...consumables.flatMap((i) => i.definition.actions),
    ];
  }

  getDamage(element: ElementDefinition) {
    return 2;
  }

  getResistance(element: ElementDefinition) {
    return 2;
  }

  getElementDamageMultiplier() {
    return 1;
  }

  getEffectAppliedStatuses(status: StatusDefinition | undefined) {
    return status;
  }

  getElementDamageTaken(element: ElementDefinition, damageAmount: number) {
    return this.ruleset.characterResistanceMultiplier(this, element) * damageAmount;
  }

  getCharacterHitModifierWithAction(action: ActionDefinition) {
    return 0;
  }

  tryHit(target: Actor) {
    return true;
  }
}
