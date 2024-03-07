import { Interaction, World } from "../..";
import { Id } from "../../lib/generate-id";
import { CharacterResource, Position } from "../character/character";
import { Status } from "../interaction/status";

export class Monster {
  definition!: MonsterDefinition;
  party!: Id;

  armorClass!: number;
  statuses!: Status[];
  position!: Position;

  currentHealth!: number;
  temporaryHealth!: number;

  resourcesCurrent!: CharacterResource[];
  resourcesMax!: CharacterResource[];

  constructor(world: World, init?: Partial<Monster>) {}
}

export class MonsterDefinition {
  id!: Id;
  name!: string;
  description!: string;

  actions!: Interaction[];
  imageUrl!: string;
  baseArmorClass!: number;
  maximumHealth!: number;

  constructor(world: World, init?: Partial<MonsterDefinition>) {
    Object.assign(this, init);
  }
}
