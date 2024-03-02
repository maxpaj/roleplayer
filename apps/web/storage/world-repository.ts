import { World, WorldEventWithRound } from "@repo/rp-lib/world";
import { Character } from "@repo/rp-lib/character";
import { JSONStorage } from "./json-storage";
import { generateId } from "@repo/rp-lib/id";

export interface IWorldRepository {
  getAll(): Promise<World[]>;
  deleteWorld(worldId: World["id"]): Promise<void>;
  createWorld(name: string): Promise<World>;
  getWorld(worldId: World["id"]): Promise<World | undefined>;
  createCharacter(worldId: World["id"], name: string): Promise<Character["id"]>;
  publishEvent(
    worldId: World["id"],
    event: WorldEventWithRound
  ): Promise<World>;
}

export class MemoryWorldRepository
  extends JSONStorage<World>
  implements IWorldRepository
{
  async updateCharacter(
    worldId: World["id"],
    characterId: Character["id"],
    update: Partial<Character>
  ) {
    const worlds = await this.getAll();
    const world = worlds.find((c) => c.id === worldId);
    if (!world) {
      throw new Error("World not found");
    }

    if (update.name) {
      world.setCharacterName(characterId, update.name);
    }

    if (update.classes) {
      world.setCharacterClasses(characterId, update.classes);
    }

    this.write(worlds);
  }

  async createBattle(worldId: string) {
    const worlds = await this.getAll();
    const world = worlds.find((c) => c.id === worldId);
    if (!world) {
      throw new Error("World not found");
    }

    const battleId = generateId();

    world.events.push({
      id: generateId(),
      type: "BattleStarted",
      battleId,
      roundId: generateId(),
    });

    return battleId;
  }

  async publishEvent(
    worldId: World["id"],
    event: WorldEventWithRound
  ): Promise<World> {
    const worlds = await this.getAll();
    const world = worlds.find((c) => c.id === worldId);
    if (!world) {
      throw new Error("World not found");
    }

    world.events.push(event);
    await this.write(worlds);
    return world;
  }

  async getCharacter(worldId: World["id"], characterId: Character["id"]) {
    const world = await this.getWorld(worldId);
    if (!world) {
      throw new Error("World not found");
    }

    const data = world.applyEvents();

    return data.characters.find((c) => c.id === characterId);
  }

  async createCharacter(worldId: World["id"], name: string) {
    const worlds = await this.getAll();
    const world = worlds.find((c) => c.id === worldId);
    if (!world) {
      throw new Error("World not found");
    }

    const characterId = generateId();
    world.createCharacter(characterId, name);

    await this.write(worlds);

    return characterId;
  }

  async deleteWorld(id: World["id"]) {
    const worlds = await this.read();
    const removed = worlds.filter((c) => c.id !== id);
    await this.write(removed);
  }

  async getAll(): Promise<World[]> {
    return this.read();
  }

  async createWorld(name: string) {
    const world = new World({
      name,
    });
    const worlds = await this.read();
    this.write([...worlds, world]);
    return world;
  }

  async getWorld(id: World["id"]) {
    const worlds = await this.read();
    const world = worlds.find((c) => c.id === id);
    if (!world) {
      throw new Error("Could not find world");
    }

    world.applyEvents();

    return world;
  }
}

export const memoryWorldRepository = new MemoryWorldRepository(
  "worlds",
  World,
  (worlds: unknown) => worlds as World[]
);
