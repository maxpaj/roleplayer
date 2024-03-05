import { World } from "@repo/rp-lib";
import { Character } from "@repo/rp-lib";
import { EntityRecord, JSONEntityStorage } from "./json-storage";
import { generateId } from "@repo/rp-lib";
import { WorldEventWithRound } from "@repo/rp-lib";

export type WorldMetadata = { isPublicTemplate: boolean; isDemo: boolean };
export type WorldStorageType = EntityRecord<World, WorldMetadata>;

export interface IWorldRepository {
  getAll(): Promise<WorldStorageType[]>;
  deleteWorld(worldId: World["id"]): Promise<void>;
  createWorld(name: string): Promise<World>;
  getWorld(worldId: World["id"]): Promise<WorldStorageType>;
  createCharacter(worldId: World["id"], name: string): Promise<Character["id"]>;
  publishEvent(
    worldId: World["id"],
    event: WorldEventWithRound
  ): Promise<World>;
}

export class MemoryWorldRepository
  extends JSONEntityStorage<World, WorldMetadata>
  implements IWorldRepository
{
  async setWorldPublicVisibility(worldId: World["id"], isVisible: boolean) {
    const worlds = await this.getAll();
    const worldData = worlds.find((c) => c.entity.id === worldId);
    if (!worldData) {
      throw new Error("World not found");
    }

    const { metadata } = worldData;
    metadata.isPublicTemplate = isVisible;
    await this.write(worlds);
  }

  async updateCharacter(
    worldId: World["id"],
    characterId: Character["id"],
    update: Partial<Character>
  ) {
    const worlds = await this.getAll();
    const worldData = worlds.find((c) => c.entity.id === worldId);
    if (!worldData) {
      throw new Error("World not found");
    }

    const { entity: world } = worldData;

    if (update.name) {
      world.setCharacterName(characterId, update.name);
    }

    if (update.classes) {
      world.setCharacterClasses(characterId, update.classes);
    }

    this.write(worlds);
  }

  async createBattle(worldId: string) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === worldId);
    if (!entityData) {
      throw new Error("World not found");
    }
    const { entity: world } = entityData;

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
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === worldId);
    if (!entityData) {
      throw new Error("World not found");
    }
    const { entity: world } = entityData;

    world.events.push(event);

    await this.write(entities);
    return world;
  }

  async getCharacter(worldId: World["id"], characterId: Character["id"]) {
    const { entity: world } = await this.getWorld(worldId);
    if (!world) {
      throw new Error("World not found");
    }

    const data = world.applyEvents();

    return data.characters.find((c) => c.id === characterId);
  }

  async createCharacter(worldId: World["id"], name: string) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === worldId);
    if (!entityData) {
      throw new Error("World not found");
    }
    const { entity: world } = entityData;

    const characterId = generateId();
    world.createCharacter(characterId, name);

    await this.write(entities);

    return characterId;
  }

  async deleteWorld(id: World["id"]) {
    const worlds = await this.read();
    const removed = worlds.filter((c) => c.entity.id !== id);
    await this.write(removed);
  }

  async getAll(): Promise<EntityRecord<World, WorldMetadata>[]> {
    return this.read();
  }

  async getDemoWorlds(): Promise<World[]> {
    const all = await this.getAll();
    return all.filter((w) => w.metadata.isDemo).map((w) => w.entity);
  }

  async getTemplateWorlds(): Promise<World[]> {
    const all = await this.getAll();
    return all.filter((w) => w.metadata.isPublicTemplate).map((w) => w.entity);
  }

  async createWorld(name: string) {
    const world = new World({
      name,
    });
    const worlds = await this.read();
    this.write([
      ...worlds,
      { entity: world, metadata: { isPublicTemplate: false, isDemo: false } },
    ]);
    return world;
  }

  async saveWorld(worldUpdate: World) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === worldUpdate.id);
    if (!entityData) {
      throw new Error("World not found");
    }
    const { entity: world } = entityData;

    Object.assign(world, worldUpdate);

    await this.write(entities);
  }

  async getWorld(id: World["id"]) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === id);
    if (!entityData) {
      throw new Error("World not found");
    }
    const { entity: world } = entityData;

    world.applyEvents();

    return entityData;
  }
}

export const memoryWorldRepository = new MemoryWorldRepository(
  "worlds",
  World,
  (worlds: unknown) => worlds as EntityRecord<World, WorldMetadata>[]
);
