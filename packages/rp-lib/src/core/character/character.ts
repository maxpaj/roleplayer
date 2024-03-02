import { Effect, ElementType } from "../interaction/effect";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import { Status } from "../interaction/status";
import { roll } from "../dice/dice";
import { Id } from "../../lib/generate-id";
import { WorldEvent, WorldEventType } from "../world/world-events";

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
  ability: Interaction | Spell;
};

export type Race = {
  name: string;
};

export type Clazz = {
  id: Id;
  name: string;
  levelProgression: ClassLevelProgression[];
};

export type Spell = {
  id: Id;
  name: string;
  level: number;
  action: Interaction;
};

export type SpellSlot = {
  level: number;
  used: boolean;
};

export type Cantrip = {};

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
  OnOtherSpellCast = "OnOtherSpellCast",
  OnDodge = "OnDodge",
}

type ReactionResource = {
  reactionId: Id;
  targetId: Id;
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

  public baseSpeed!: number;
  public baseArmorClass!: number;
  public baseStrength!: number;
  public baseDexterity!: number;
  public baseConstitution!: number;
  public baseIntelligence!: number;
  public baseWisdom!: number;
  public baseCharisma!: number;
  public defense!: number;

  public spellSlots!: SpellSlot[];
  public cantrips!: Cantrip[];
  public classes!: CharacterClass[];
  public statuses!: Status[];
  public inventory!: Item[];
  public equipment!: CharacterEquipmentSlot[];
  public baseActions!: Interaction[];
  public spells!: Spell[];
  public position!: Position;
  public movementSpeed!: number;

  // Temporary resources
  public currentHealth!: number;
  public temporaryHealth!: number;
  public movementRemaining!: number;
  public actionResourcesRemaining: ActionResourceType[];
  public reactionsRemaining!: ReactionResource[];
  public reactions!: Reaction[];

  public constructor(init?: Partial<Character>) {
    this.cantrips = [];
    this.statuses = [];
    this.inventory = [];
    this.equipment = [];
    this.baseActions = [];
    this.spellSlots = [];
    this.spells = [];
    this.classes = [];
    this.actionResourcesRemaining = [];
    this.reactionsRemaining = [];

    Object.assign(this, init);
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
      ...this.baseActions,
      ...this.equipment
        .flatMap((eq) => eq.item)
        .filter((i) => i)
        .flatMap((i) => i!.actions),
      ...this.spells.map((s) => s.action),
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
