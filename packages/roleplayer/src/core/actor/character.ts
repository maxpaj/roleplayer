import { Id } from "../../lib/generate-id";
import { CampaignEvent, CampaignEventType, CampaignEventWithRound } from "../campaign/campaign-events";
import { D20 } from "../dice/dice";
import { Effect, ElementType } from "../world/action/effect";
import { ActionDefinition } from "../world/action/action";
import { Status } from "../world/action/status";
import { EquipmentSlotDefinition, Item } from "../world/item/item";
import { Party } from "../campaign/party";
import { World } from "../world/world";
import { Alignment, CharacterResourceType, CharacterStatType, Clazz, Race } from "../ruleset/ruleset";

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
  resourceTypeId: CharacterResourceType["id"];
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
  statuses: Status[] = [];
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

  rollInitiative(): number {
    return this.world.roll(D20);
  }

  getActions(): ActionDefinition[] {
    return this.actions;
  }

  getAbilityModifier() {
    return 0;
  }

  getResourceGeneration(): CharacterResourceGeneration[] {
    return [];
  }

  resetResources() {
    this.resources = this.resources.map((r) => ({ ...r, amount: r.max }));
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

  getResistanceMultiplier(damageType: ElementType) {
    return 1;
  }

  getResistanceAbsolute(damageType: ElementType) {
    return 0;
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

  getEffectAppliedStatuses(status: Status | undefined) {
    return status;
  }

  getEffectDamageTaken(effect: Effect, damageAmount: number) {
    return Math.max(
      damageAmount * this.getResistanceMultiplier(effect.element) - this.getResistanceAbsolute(effect.element),
      0
    );
  }

  getCharacterHitModifierWithAction(action: ActionDefinition) {
    return 0;
  }

  applyEffects(effects: Effect) {}

  tryHit(target: Actor) {
    return true;
  }
}
