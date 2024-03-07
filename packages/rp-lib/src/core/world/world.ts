import {
  DefaultCharacterResourceTypes,
  DefaultCharacterStatTypes,
  DefaultEquipmentSlotDefinitions,
  DefaultLevelProgression,
} from "../../data/data";
import { Id, generateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import {
  Character,
  CharacterClass,
  CharacterResourceType,
  CharacterStatType,
  Clazz,
  LevelExperience,
} from "../character/character";
import { Interaction } from "../interaction/interaction";
import { Status } from "../interaction/status";
import {
  EquipmentSlotDefinition as EquipmentSlotDefinition,
  Item,
} from "../item/item";
import { WorldMap } from "../map/map";
import { MonsterDefinition } from "../monster/monster";

type Version = `${string}.${string}.${string}`;

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id: Id;
  name: string;
  libVersion: Version;

  monsters: MonsterDefinition[] = [];
  maps: WorldMap[] = [];
  items: Item[] = [];
  characters: Character[] = [];
  actions: Interaction[] = [];
  statuses: Status[] = [];
  levelProgression: LevelExperience[] = DefaultLevelProgression;
  characterStatTypes: CharacterStatType[] = DefaultCharacterStatTypes;

  characterResourceTypes: CharacterResourceType[] =
    DefaultCharacterResourceTypes;

  characterEquipmentSlots: EquipmentSlotDefinition[] =
    DefaultEquipmentSlotDefinitions;

  classes: Clazz[] = [];

  constructor(w: AugmentedRequired<Partial<World>, "name">) {
    Object.assign(this, w);
    this.id = w.id || generateId();
    this.name = w.name;
    this.libVersion = w.libVersion || "0.0.0"; // TODO: Should be injected at build time, should throw if the version of the world isn't supported by the lib
  }

  createCharacter(characterId: Character["id"], name: string) {
    throw new Error("Not implemented");
  }

  setCharacterName(characterId: Character["id"], name: string) {
    throw new Error("Not implemented");
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    throw new Error("Not implemented");
  }
}
