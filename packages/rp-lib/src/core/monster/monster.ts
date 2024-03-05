import { World } from "../..";
import { Id } from "../../lib/generate-id";

export class Monster {
  id!: Id;
  name!: string;

  public constructor(world: World, init?: Partial<Monster>) {
    Object.assign(this, init);
  }
}
