import { Clazz, Race, Ruleset } from "../..";
import { Id } from "../../lib/generate-id";
import { ActionDefinition } from "../action/action";
import { StatusDefinition } from "../action/status";
import { Actor } from "../actor/character";
import { ItemDefinition } from "../inventory/item";

/**
 * Container for all world related things. Is limited to what is allowed by the ruleset.
 * Holds information about items, spells, statuses, etc. that exists in the world.
 *
 * - items (Frost Sword, Light Saber)
 * - actions (Frostburn action def) ()
 * - spells
 */
export class World {
  id!: Id;
  name!: string;

  ruleset: Ruleset;
  itemTemplates: ItemDefinition[] = [];
  actorTemplates: Actor[] = [];
  races: Race[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  classes: Clazz[] = [];

  constructor(ruleset: Ruleset, name: string, w: Partial<World>) {
    Object.assign(this, w);
    this.ruleset = ruleset;
    this.name = name;
  }
}
