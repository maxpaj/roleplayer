import { Id } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { Character, CharacterClass, Clazz, Race } from "../actor/character";
import { Action } from "./action/action";
import { Monster } from "../actor/monster";
import { Item } from "./item/item";
import { Status } from "./action/status";
import { Version } from "../..";
import { Ruleset } from "../ruleset/ruleset";

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id!: Id;
  name!: string;
  libVersion: typeof Version;

  monsters: Monster[] = [];
  items: Item[] = [];
  characters: Character[] = [];
  actions: Action[] = [];
  races: Race[] = [];
  statuses: Status[] = [];
  classes: Clazz[] = [];
  ruleset!: Ruleset;

  constructor(w: AugmentedRequired<Partial<World>, "name" | "ruleset">) {
    Object.assign(this, w);
    this.libVersion = w.libVersion || Version; // TODO: Should throw if the version of this world isn't supported by the lib
  }

  createCharacter(characterId: Character["id"], name: string) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (existing) {
      throw new Error("Cannot create character, duplicate exists");
    }

    this.characters.push(new Character({ id: characterId, name }));
  }

  setCharacterName(characterId: Character["id"], name: string) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (!existing) {
      throw new Error("Cannot find character");
    }

    existing.name = name;
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    const existing = this.characters.find((c) => c.id === characterId);
    if (!existing) {
      throw new Error("Cannot find character");
    }

    existing.classes = classes;
  }
}
