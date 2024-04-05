import { Clazz, Race, Ruleset } from "../..";
import { Id } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { ActionDefinition } from "../action/action";
import { StatusDefinition } from "../action/status";
import { Actor } from "../actor/character";
import { ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";

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
  roleplayer!: Roleplayer;
  ruleset!: Ruleset;

  itemTemplates: ItemDefinition[] = [];
  actorTemplates: Actor[] = [];
  races: Race[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  classes: Clazz[] = [];

  constructor(w: AugmentedRequired<Partial<World>, "id" | "name" | "roleplayer" | "ruleset">) {
    Object.assign(this, w);
  }
}
