import { Effect, ElementType } from "../interaction/effect";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import { Status } from "../interaction/status";
import { roll } from "../dice/dice";
import { Id } from "../../lib/generate-id";
import { WorldEvent, WorldEventType } from "../world/world-events";
import { World } from "../world/world";

export function isCharacterEvent(
  event: WorldEvent
): event is Extract<WorldEvent, { characterId: Character["id"] }> {
  return (event as any).characterId !== undefined;
}

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
  onEvent: WorldEventType;
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

type Reaction = {
  id: Id;
  name: string;
  type: ReactionEventType;
  eventType: WorldEventType["type"];
  interaction: Interaction;
};

export enum ReactionEventType {
  OnHit = "OnHit",
  OnDodge = "OnDodge",
}

type ReactionResource = {
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

export class Character {
  public id!: Id;
  public party!: Id;
  public isPlayerControlled!: boolean;
  public exists!: boolean;

  public name!: string;
  public playerName!: string;
  public imageUrl!: string;

  public xp!: number;
  public race!: Race;
  public gold!: number;
  public faction!: string;
  public background!: string;
  public alignment!: Alignment;
  public maximumHealth!: number;

  public baseArmorClass!: number;
  public armorClass!: number;
  public stats!: CharacterStat[];

  public classes!: CharacterClass[];
  public statuses!: Status[];
  public inventory!: Item[];
  public equipment!: CharacterEquipmentSlot[];
  public actions!: Interaction[];
  public position!: Position;

  // TODO: Should these be inherited from the first class the character gains?
  public spellCastingAbilityStatId!: CharacterStatType["id"];
  public abilityModifierStatId!: CharacterStatType["id"];

  // Temporary resources
  public resourcesCurrent!: CharacterResource[];
  public resourcesMax!: CharacterResource[];

  public currentHealth!: number;
  public temporaryHealth!: number;
  public reactionsRemaining!: ReactionResource[];
  public reactions!: Reaction[];

  public constructor(world: World, init?: Partial<Character>) {
    this.statuses = [];
    this.inventory = [];
    this.equipment = [];
    this.actions = [];
    this.classes = [];
    this.stats = [];

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
