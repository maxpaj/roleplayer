import { Id } from "../../lib/generate-id";
import { Actor, CharacterClass } from "../actor/character";
import { ActionDefinition } from "./action/action";
import { Item } from "./item/item";
import { StatusDefinition } from "./action/status";
import { Clazz, Race, Roll, Ruleset } from "../..";

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

  monsters: Actor[] = [];
  items: Item[] = [];
  characters: Actor[] = [];
  actions: ActionDefinition[] = [];
  races: Race[] = [];
  statuses: StatusDefinition[] = [];
  classes: Clazz[] = [];
  ruleset: Ruleset;

  constructor(ruleset: Ruleset, name: string, w: Partial<World>) {
    Object.assign(this, w);
    this.ruleset = ruleset;
    this.name = name;
  }

  addCharacter(characterId: Actor["id"], name: string) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (existing) {
      throw new Error("Cannot create character, duplicate exists");
    }

    this.characters.push(new Actor(this, { id: characterId, name }));
  }

  setCharacterName(characterId: Actor["id"], name: string) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (!existing) {
      throw new Error("Cannot find character");
    }

    existing.name = name;
  }

  setCharacterClasses(characterId: Actor["id"], classes: CharacterClass[]) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (!existing) {
      throw new Error("Cannot find character");
    }

    existing.classes = classes;
  }
}
