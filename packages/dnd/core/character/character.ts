import { Effect, ElementType } from "../interaction/effect";
import { Id } from "../id";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import {
  CampaignEvent,
  Campaign,
  CampaignEventType,
  Position,
} from "../campaign/campaign";
import { Status } from "../interaction/status";
import { roll } from "../dice/dice";

export enum ActionType {
  Attack = "attack",
  Sprint = "sprint",
  Jump = "jump",
  Cantrip = "cantrip",
  Spell = "spell",
  Item = "item",
  Equipment = "equipment",
  None = "none",
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
  unlockedAtLevel: 0;
  interaction: Interaction;
};

export type Race = {
  name: string;
};

export type Clazz = {
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

  public background!: string;
  public faction!: string;
  public race!: Race;
  public alignment!: Alignment;
  public xp!: number;
  public maximumHealth!: number;
  public currentHealth!: number;
  public temporaryHealth!: number;

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
  public characterClasses!: CharacterClass[];
  public statuses!: Status[];
  public inventory!: Item[];
  public equipment!: Item[];
  public baseAttacks!: Interaction[];
  public spells!: Spell[];
  public position!: Position;
  public movementSpeed!: number;
  public moveSpeedRemaining!: number;

  public constructor(init?: Partial<Character>) {
    this.cantrips = [];
    this.statuses = [];
    this.inventory = [];
    this.equipment = [];
    this.baseAttacks = [];
    this.spellSlots = [];
    this.spells = [];

    Object.assign(this, init);
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
      ...this.equipment.reduce((ac, eq) => {
        return [...ac, ...eq.actions];
      }, [] as Interaction[]),
      ...this.spells.map((s) => s.action),
    ];
  }

  getEffectAppliedStatuses(status: Status | undefined) {
    return status;
  }

  getEffectDamageTaken(effect: Effect) {
    if (
      effect.amountStatic === undefined &&
      effect.amountVariable === undefined
    ) {
      return undefined;
    }

    const amount =
      (effect.amountStatic || 0) + roll(effect.amountVariable || 0);

    return (
      amount * this.getResistanceMultiplier(effect.element) -
      this.getResistanceAbsolute(effect.element)
    );
  }

  applyEffects(effects: Effect) {}

  applyEvent(event: CampaignEvent, campaign: Campaign) {
    switch (event.eventType) {
      case CampaignEventType.NewRound:
        this.moveSpeedRemaining = this.movementSpeed;
        break;
      case CampaignEventType.CharacterPrimaryAction:
      case CampaignEventType.CharacterSecondaryAction:
        switch (event.actionType) {
          case ActionType.Spell:
            const spell = campaign.spells.find((s) => s.id === event.spellId);
            if (!spell) {
              throw new Error(`Spell ${event.spellId} not found`);
            }

            const spellSlot = this.spellSlots.find(
              (s) => s.level === spell.level && !s.used
            );
            if (!spellSlot) {
              throw new Error(
                `Character spell slot at level ${spell.level} not found`
              );
            }

            spellSlot.used = true;
            break;
          case ActionType.Attack:

          default:
            console.warn("Unknown primary action type");
            break;
        }
        break;

      case CampaignEventType.CharacterSpawned:
        this.exists = true;
        break;

      case CampaignEventType.CharacterDespawn:
        this.exists = false;
        break;

      case CampaignEventType.CharacterMoveSpeedChange:
        if (event.amount === undefined || event.amount < 0) {
          throw new Error(
            "Cannot set movespeed to non-positive number for CharacterMoveSpeedChange"
          );
        }

        this.movementSpeed = event.amount;
        break;

      case CampaignEventType.CharacterPositionChange:
        if (event.targetPosition === undefined) {
          throw new Error(
            "Target position not defined for CharacterPositionChange"
          );
        }

        this.position = event.targetPosition;
        break;

      case CampaignEventType.CharacterHealthChangeRelative:
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterHealthChangeRelative"
          );
        }

        this.currentHealth += event.amount;
        break;

      case CampaignEventType.CharacterHealthChangeAbsolute:
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterHealthChangeAbsolute"
          );
        }

        this.currentHealth = event.amount;
        break;

      case CampaignEventType.CharacterPermanentHealthChange:
        if (event.amount === undefined) {
          throw new Error(
            "Amount is not defined for CharacterPermanentHealthChange"
          );
        }

        this.maximumHealth = event.amount || -1;
        break;

      case CampaignEventType.CharacterSpellGain:
        const spell = campaign.spells.find((s) => s.id === event.spellId);
        if (!spell) {
          throw new Error(
            `Could not find spell with id ${event.spellId} for CharacterGainSpell`
          );
        }

        this.spells.push(spell);
        break;

      case CampaignEventType.CharacterStatusGain:
        const status = campaign.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(
            `Could not find status with id ${event.spellId} for CharacterGainSpell`
          );
        }

        this.statuses.push(status);
        break;

      case CampaignEventType.CharacterItemGain:
        const item = campaign.items.find((eq) => eq.id === event.itemId);
        if (!item) {
          throw new Error(
            `Could not find item with id ${event.itemId} for CharacterGainItem`
          );
        }

        this.inventory.push(item);
        break;

      case CampaignEventType.CharacterMovement:
        if (event.targetPosition === undefined) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = this.position.x + event.targetPosition.x;
        const distanceY = this.position.y + event.targetPosition.y;
        const distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        if (distance > this.moveSpeedRemaining) {
          throw new Error(
            "Movement exceeds remaining speed for CharacterMovement"
          );
        }

        this.moveSpeedRemaining -= distance;
        this.position.x = event.targetPosition.x;
        this.position.y = event.targetPosition.y;
        break;

      default:
        console.warn(`Unhandled event ${event.id}, type ${event.eventType}`);
        break;
    }
  }
}
