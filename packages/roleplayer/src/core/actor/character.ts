import { Id } from "../../lib/generate-id";
import { CampaignEvent, CampaignEventType, CampaignEventWithRound } from "../campaign/campaign-events";
import { ActionDefinition } from "../world/action/action";
import { StatusDefinition } from "../world/action/status";
import { EquipmentSlotDefinition, Item } from "../world/item/item";
import { Party } from "../campaign/party";
import { World } from "../world/world";
import {
  Alignment,
  CharacterResourceDefinition,
  CharacterStatType,
  Clazz,
  ElementDefinition,
  Race,
} from "../ruleset/ruleset";

export enum ActorType {
  Monster = "Monster",
  Character = "Character",
  World = "World",
}

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type CharacterResource = {
  resourceTypeId: CharacterResourceDefinition["id"];
  amount: number;
  max: number;
  min: number;
};

export type CharacterResourceGeneration = CharacterResource & {
  onEvent: CampaignEventType;
};

export type CharacterClass = {
  level: number;
  classId: Clazz["id"];
};

export type CharacterEquipmentSlot = {
  item?: Item;
  slotId: EquipmentSlotDefinition["id"];
};

export type Reaction = {
  id: Id;
  name: string;
  type: ReactionEventType;
  eventType: CampaignEventType["type"];
  action: ActionDefinition;
};

export enum ReactionEventType {
  OnHit = "OnHit",
  OnDodge = "OnDodge",
}

export type ReactionResource = {
  reactionId: Reaction["id"];
  targetId: Actor["id"];
};

export type CharacterStat = {
  statId: CharacterStatType["id"];
  amount: number;
};

export function isCharacterEvent(event: CampaignEvent): event is Extract<CampaignEvent, { characterId: Actor["id"] }> {
  return (event as any).characterId !== undefined;
}

export class Actor {
  id!: Id;
  party!: Party["id"];
  exists!: boolean;

  type!: "Player" | "NPC";

  xp!: number;
  name!: string;
  race!: Race["id"];
  description?: string;
  alignment!: Alignment;
  classes: CharacterClass[] = [];

  inventory: Item[] = [];
  equipment: CharacterEquipmentSlot[] = [];

  stats: CharacterStat[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  position!: Position;

  resources: CharacterResource[] = [];
  reactionsRemaining: ReactionResource[] = [];
  reactions: Reaction[] = [];

  world: World;

  constructor(world: World, init?: Partial<Actor>) {
    Object.assign(this, init);
    this.world = world;
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
    return this.world.ruleset.characterResourceGeneration(this);
  }

  resetResources() {
    this.resources = this.resources.map((r) => ({ ...r, amount: r.max }));
  }

  getBattleActionOrder() {
    return this.world.ruleset.characterBattleActionOrder(this);
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
    return this.world.ruleset.characterResistanceMultiplier(this, damageType);
  }

  getResistanceAbsolute(damageType: ElementDefinition) {
    return this.world.ruleset.characterResistanceAbsolute(this, damageType);
  }

  /**
   * Get all available actions for the characters, based on equipment, class, spells, etc.
   * @returns A list of available actions
   */
  getAvailableActions(): ActionDefinition[] {
    return [
      ...this.actions,
      ...this.equipment
        .flatMap((eq) => eq.item)
        .filter((i) => i)
        .flatMap((i) => i!.actions),
      ...this.inventory.flatMap((i) => i.actions),
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
    return this.world.ruleset.characterResistanceMultiplier(this, element) * damageAmount;
  }

  getCharacterHitModifierWithAction(action: ActionDefinition) {
    return 0;
  }

  tryHit(target: Actor) {
    return true;
  }
}
