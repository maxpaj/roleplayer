import { Interaction, World } from "../..";
import { Id } from "../../lib/generate-id";
import { CharacterResource, Position } from "../character/character";
import { Status } from "../interaction/status";

export class Monster {
  id!: Id;
  name!: string;
  actions!: Interaction[];
  party!: Id;
  imageUrl!: string;
  baseArmorClass!: number;
  armorClass!: number;
  statuses!: Status[];
  position!: Position;

  maximumHealth!: number;
  currentHealth!: number;
  temporaryHealth!: number;

  resourcesCurrent!: CharacterResource[];
  resourcesMax!: CharacterResource[];

  constructor(world: World, init?: Partial<Monster>) {
    Object.assign(this, init);
  }
}
