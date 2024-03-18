import { Campaign } from "../..";
import { Id } from "../../lib/generate-id";
import { CampaignEvent, CampaignEventType, CampaignEventWithRound } from "../campaign/campaign-events";
import { D20, roll } from "../dice/dice";
import { Effect, ElementType } from "../world/interaction/effect";
import { Interaction } from "../world/interaction/interaction";
import { Status } from "../world/interaction/status";
import { EquipmentSlotDefinition, Item } from "../world/item/item";
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

export type LevelProgression = {
  id: Id;
  requiredXp: number;
  unlocksLevel: number;
  onLevelUp?: (character: Character, publishEvent: Campaign["publishCampaignEvent"]) => void;
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
  interaction: Interaction;
};

export enum ReactionEventType {
  OnHit = "OnHit",
  OnDodge = "OnDodge",
}

export type ReactionResource = {
  reactionId: Reaction["id"];
  targetId: Actor["id"];
};

export type CharacterStatType = {
  id: Id;
  name: string;
};

export type CharacterStat = {
  statId: CharacterStatType["id"];
  amount: number;
};

export function isCharacterEvent(event: CampaignEvent): event is Extract<CampaignEvent, { characterId: Character["id"] }> {
  return (event as any).characterId !== undefined;
}

export class Character implements Actor {
  id!: Id;
  party!: Id;
  exists!: boolean;
  isPlayerControlled!: boolean;

  name!: string;
  description?: string;
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

  spellCastingAbilityStatId!: CharacterStatType["id"][];
  abilityModifierStatId!: CharacterStatType["id"][];
  resources: CharacterResource[] = [];
  reactionsRemaining: ReactionResource[] = [];
  reactions: Reaction[] = [];

  constructor(init?: Partial<Character>) {
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

  rollInitiative(): number {
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
    this.resources = this.resources.map((r) => ({ ...r, amount: r.max }));
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
    return Math.max(damageAmount * this.getResistanceMultiplier(effect.element) - this.getResistanceAbsolute(effect.element), 0);
  }

  getCharacterHitModifierWithInteraction(interaction: Interaction) {
    return 0;
  }

  applyEffects(effects: Effect) {}
}
