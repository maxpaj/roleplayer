import { Effect, ElementType } from "../interaction/effect";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import {
  Campaign,
  CampaignEventWithRound,
  Position,
} from "../campaign/campaign";
import { Status } from "../interaction/status";
import { roll } from "../dice/dice";
import { Id, generateId } from "../../lib/generate-id";

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
  clazz: Clazz;
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
  public equipment!: Item[];
  public baseActions!: Interaction[];
  public spells!: Spell[];
  public position!: Position;
  public movementSpeed!: number;

  // Temporary resources
  public currentHealth!: number;
  public temporaryHealth!: number;
  public movementRemaining!: number;
  public actionResourcesRemaining: ActionResourceType[];

  public constructor(init?: Partial<Character>) {
    this.id = generateId();
    this.name = "New character";

    this.cantrips = [];
    this.statuses = [];
    this.inventory = [];
    this.equipment = [];
    this.baseActions = [];
    this.spellSlots = [];
    this.spells = [];
    this.actionResourcesRemaining = [];

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
      ...this.equipment.flatMap((eq) => eq.actions),
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

  applyEvent(event: CampaignEventWithRound, campaign: Campaign) {
    switch (event.type) {
      case "NewRound":
        this.movementRemaining = this.movementSpeed;
        this.actionResourcesRemaining = [
          ActionResourceType.Primary,
          ActionResourceType.Secondary,
        ];
        break;
      case "CharacterPrimaryAction":
      case "CharacterSecondaryAction":
        break;

      case "CharacterSpawned":
        this.exists = true;
        break;

      case "CharacterDespawn":
        this.exists = false;
        break;

      case "CharacterMoveSpeedChange":
        if (event.amount === undefined || event.amount < 0) {
          throw new Error(
            "Cannot set movespeed to non-positive number for CharacterMoveSpeedChange"
          );
        }

        this.movementSpeed = event.amount;
        break;

      case "CharacterPositionChange":
        if (event.targetPosition === undefined) {
          throw new Error(
            "Target position not defined for CharacterPositionChange"
          );
        }

        this.position = event.targetPosition;
        break;

      case "CharacterHealthChange":
        if (event.amount === undefined || event.amount < 0) {
          throw new Error("Amount is not defined for CharacterHealthGain");
        }

        this.currentHealth = event.amount;
        break;

      case "CharacterHealthGain":
        if (event.amount === undefined || event.amount < 0) {
          throw new Error("Amount is not defined for CharacterHealthGain");
        }

        this.currentHealth += event.amount;
        break;

      case "CharacterHealthLoss":
        if (event.amount === undefined || event.amount < 0) {
          throw new Error("Amount is not defined for CharacterHealthLoss");
        }

        this.currentHealth -= event.amount;
        break;

      case "CharacterHealthChange":
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterHealthChangeRelative"
          );
        }

        this.currentHealth += event.amount;
        break;

      case "CharacterHealthChange":
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterHealthChangeAbsolute"
          );
        }

        this.currentHealth = event.amount;
        break;

      case "CharacterPermanentHealthChange":
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterPermanentHealthChange"
          );
        }

        this.maximumHealth = event.amount || -1;
        break;

      case "CharacterSpellGain":
        const spell = campaign.spells.find((s) => s.id === event.spellId);
        if (spell === undefined) {
          throw new Error(
            `Could not find spell with id ${event.spellId} for CharacterGainSpell`
          );
        }

        this.spells.push(spell);
        break;

      case "CharacterStatusGain":
        const status = campaign.statuses.find((s) => s.id === event.statusId);
        if (status === undefined) {
          throw new Error(
            `Could not find status with id ${event.statusId} for CharacterGainSpell`
          );
        }

        this.statuses.push(status);
        break;

      case "CharacterItemGain":
        const item = campaign.items.find((eq) => eq.id === event.itemId);
        if (item === undefined) {
          throw new Error(
            `Could not find item with id ${event.itemId} for CharacterGainItem`
          );
        }

        this.inventory.push(item);
        break;

      case "CharacterMovement":
        if (event.targetPosition === undefined) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = this.position.x + event.targetPosition.x;
        const distanceY = this.position.y + event.targetPosition.y;
        const distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        if (distance > this.movementRemaining) {
          throw new Error(
            "Movement exceeds remaining speed for CharacterMovement"
          );
        }

        this.movementRemaining -= distance;
        this.position.x = event.targetPosition.x;
        this.position.y = event.targetPosition.y;
        break;

      default:
        console.warn(`Unhandled event ${event.id}, type ${event.type}`);
        break;
    }
  }
}
