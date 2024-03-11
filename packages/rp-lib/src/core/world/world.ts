import {
  DefaultCharacterResourceTypes,
  DefaultCharacterStatTypes,
  DefaultEquipmentSlotDefinitions,
  DefaultLevelProgression,
} from "../../data/data";
import { Id } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import {
  Character,
  CharacterClass,
  CharacterResourceType,
  CharacterStatType,
  Clazz,
  LevelExperience,
} from "../actor/character";
import { Interaction } from "../world/interaction/interaction";
import { Monster } from "../actor/monster";
import { EquipmentSlotDefinition, Item } from "./item/item";
import { Status } from "./interaction/status";
import { Version } from "../..";

type Version = `${string}.${string}.${string}`;

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id!: Id;
  name!: string;
  libVersion: Version;

  monsters: Monster[] = [];
  items: Item[] = [];
  characters: Character[] = [];
  actions: Interaction[] = [];
  statuses: Status[] = [];
  classes: Clazz[] = [];

  levelProgression: LevelExperience[] = DefaultLevelProgression;
  characterStatTypes: CharacterStatType[] = DefaultCharacterStatTypes;

  characterResourceTypes: CharacterResourceType[] =
    DefaultCharacterResourceTypes;

  characterEquipmentSlots: EquipmentSlotDefinition[] =
    DefaultEquipmentSlotDefinitions;

  constructor(w: AugmentedRequired<Partial<World>, "name">) {
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
