import { Id } from "../../lib/generate-id";
import { CharacterResource, CharacterResourceType, Position } from "./character";
import { Actor, ActorType } from "./actor";
import { Action } from "../world/action/action";
import { D20, roll } from "../dice/dice";
import { CampaignEventWithRound } from "../campaign/campaign-events";
import { Status } from "../world/action/status";

export class MonsterInstance implements Actor {
  id!: Id;
  name!: string;

  definition!: Monster;
  party!: Id;

  armorClass!: number;
  statuses!: Status[];
  position!: Position;

  currentHealth!: number;
  temporaryHealth!: number;

  resourcesCurrent!: CharacterResource[];
  resourcesMax!: CharacterResource[];

  constructor(init?: Partial<MonsterInstance>) {
    Object.assign(this, init);
  }

  getName() {
    return this.definition.name;
  }

  getAbilityModifier(): number {
    return 0;
  }

  getType(): ActorType {
    return ActorType.Monster;
  }

  getEligibleTargets(action: Action): Actor[] {
    throw new Error("Method not implemented.");
  }

  getAvailableActions(): Action[] {
    return this.definition.actions || [];
  }

  performAction(): CampaignEventWithRound[] {
    throw new Error("Method not implemented.");
  }

  rollInitiative(): number {
    return roll(D20);
  }

  getActions(): Action[] {
    return this.definition.actions;
  }
}

type ChallengeRating = "1/8" | "1/4" | "1/2" | "1" | "2";

export class Monster {
  id!: Id;
  name!: string;
  challengeRating!: ChallengeRating;
  baseArmorClass!: number;
  resources!: { max: number; resourceType: CharacterResourceType }[];
  actions!: Action[];

  constructor(init?: Partial<Monster>) {
    Object.assign(this, init);
  }
}
