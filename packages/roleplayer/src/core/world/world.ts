import { Id } from "../../lib/generate-id";
import { Actor, CharacterClass } from "../actor/character";
import { ActionDefinition } from "./action/action";
import { Item } from "./item/item";
import { Status } from "./action/status";
import { Clazz, Race, Roll, Ruleset } from "../..";

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id!: Id;
  name!: string;

  monsters: Actor[] = [];
  items: Item[] = [];
  characters: Actor[] = [];
  actions: ActionDefinition[] = [];
  races: Race[] = [];
  statuses: Status[] = [];
  classes: Clazz[] = [];

  // System stuff
  ruleset: Ruleset;
  roll: Roll;

  constructor(ruleset: Ruleset, roll: Roll, name: string, w: Partial<World>) {
    Object.assign(this, w);
    this.ruleset = ruleset;
    this.name = name;
    this.roll = roll;
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
