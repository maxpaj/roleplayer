import { Effect, ElementType } from "../interaction/effect";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import { Status } from "../interaction/status";
import { D20, roll } from "../dice/dice";
import { Id } from "../../lib/generate-id";
import {
  CampaignEvent,
  CampaignEventType,
  CampaignEventWithRound,
} from "../campaign/campaign-events";
import { World } from "../world/world";
import { Actor, ActorType } from "./actor";

export type Position = {
  x: number;
  y: number;
  z: number;
};

export enum ActionResourceType {
  Primary = "Primary",
  Secondary = "Secondary",
}

export enum Alignment {
  NeutralEvil = "NeutralEvil",
  LawfulEvil = "LawfulEvil",
  ChaoticEvil = "ChaoticEvil",
  NeutralNeutral = "NeutralNeutral",
  EvilNeutral = "EvilNeutral",
  GoodNeutral = "GoodNeutral",
  NeutralGood = "NeutralGood",
  LawfulGood = "LawfulGood",
  ChaoticGood = "ChaoticGood",
}

export type ClassLevelProgression = {
  unlockedAtLevel: number;
  abilityId: Interaction["id"];
};

export type Race = {
  name: string;
};

export type Clazz = {
  id: Id;
  name: string;
  levelProgression: ClassLevelProgression[];
};

export type CharacterResourceType = {
  id: Id;
  name: string;
  defaultMax?: number;
};

export type CharacterResource = {
  resourceId: CharacterResourceType["id"];
  amount: number;
};

export type CharacterResourceGeneration = CharacterResource & {
  onEvent: CampaignEventType;
};

export type CharacterClass = {
  level: number;
  classId: Clazz["id"];
};

export type LevelExperience = number;

export type CharacterEquipmentSlot = {
  item?: Item;
  slotId: string;
};

export type Reaction = {
  id: Id;
  name: string;
  type: ReactionEventType;
  eventType: CampaignEventType["type"];
  interaction: Interaction;
};

export enum ReactionEventType {
  OnHit = "OnHit",
  OnDodge = "OnDodge",
}

export type ReactionResource = {
  reactionId: Id;
  targetId: Id;
};

export type CharacterStatType = {
  id: Id;
  name: string;
};

export type CharacterStat = {
  statId: CharacterStatType["id"];
  amount: number;
};

export function isCharacterEvent(
  event: CampaignEvent
): event is Extract<CampaignEvent, { characterId: Character["id"] }> {
  return (event as any).characterId !== undefined;
}

export class Character implements Actor {
  id!: Id;
  party!: Id;
  exists!: boolean;
  isPlayerControlled!: boolean;

  name!: string;
  description!: string;
  playerName!: string;
  alignment!: Alignment;

  xp!: number;
  race!: Race;
  gold!: number;

  baseArmorClass!: number;
  armorClass!: number;
  stats: CharacterStat[] = [];

  actions: Interaction[] = [];
  classes: CharacterClass[] = [];
  statuses: Status[] = [];
  inventory: Item[] = [];
  equipment: CharacterEquipmentSlot[] = [];
  position!: Position;

  maximumHealth!: number;

  // TODO: Should these be inherited from the first class the character gains?
  spellCastingAbilityStatId!: CharacterStatType["id"];
  abilityModifierStatId!: CharacterStatType["id"];

  // Temporary resources
  resourcesCurrent: CharacterResource[] = [];
  resourcesMax: CharacterResource[] = [];

  currentHealth!: number;
  temporaryHealth!: number;
  reactionsRemaining: ReactionResource[] = [];
  reactions: Reaction[] = [];

  constructor(world: World, init?: Partial<Character>) {
    this.reactionsRemaining = [];
    this.resourcesCurrent = world.characterResourceTypes.map((cr) => ({
      amount: cr.defaultMax || 0,
      resourceId: cr.id,
    }));
    this.resourcesMax = world.characterResourceTypes.map((cr) => ({
      amount: cr.defaultMax || 0,
      resourceId: cr.id,
    }));

    Object.assign(this, init);
  }

  getType(): ActorType {
    return ActorType.Character;
  }

  getEligibleTargets(action: Interaction): Actor[] {
    throw new Error("Method not implemented.");
  }

  performAction(): CampaignEventWithRound[] {
    throw new Error("Method not implemented.");
  }

  getInitiative(): number {
    return roll(D20);
  }

  getActions(): Interaction[] {
    return this.actions;
  }

  getAbilityModifier() {
    return 0;
  }

  getResourceGeneration(): CharacterResourceGeneration[] {
    return [];
  }

  resetResources() {
    this.resourcesCurrent = this.resourcesMax;
  }

  getDamageRoll(effect: Effect) {
    return (effect.amountStatic || 0) + roll(effect.amountVariable || 0);
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
  getAvailableActions(): Interaction[] {
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
      damageAmount * this.getResistanceMultiplier(effect.element) -
        this.getResistanceAbsolute(effect.element),
      0
    );
  }

  getCharacterHitModifierWithInteraction(interaction: Interaction) {
    return 0;
  }

  applyEffects(effects: Effect) {}
}
