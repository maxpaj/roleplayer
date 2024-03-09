import { Id } from "../../lib/generate-id";
import { CharacterResource, Position } from "./character";
import { Status } from "../interaction/status";
import { Actor } from "./actor";
import { World } from "../world/world";
import { Interaction } from "../interaction/interaction";
import { D20, roll } from "../dice/dice";
import { CampaignEventWithRound } from "../campaign/campaign-events";

export class Monster implements Actor {
  id!: Id;
  name!: string;

  definition!: MonsterDefinition;
  party!: Id;

  armorClass!: number;
  statuses!: Status[];
  position!: Position;

  currentHealth!: number;
  temporaryHealth!: number;

  resourcesCurrent!: CharacterResource[];
  resourcesMax!: CharacterResource[];

  constructor(world: World, init?: Partial<Monster>) {
    Object.assign(this, init);
  }

  getAvailableActions(): Interaction[] {
    return this.definition.actions;
  }

  performAction(): CampaignEventWithRound[] {
    throw new Error("Method not implemented.");
  }

  getInitiative(): number {
    return roll(D20);
  }

  getActions(): Interaction[] {
    return this.definition.actions;
  }
}

export class MonsterDefinition {
  id!: Id;
  name!: string;
  challengeRating!: number;
  baseArmorClass!: number;
  maximumHealth!: number;
  actions!: Interaction[];

  constructor(world: World, init?: Partial<MonsterDefinition>) {
    Object.assign(this, init);
  }
}
