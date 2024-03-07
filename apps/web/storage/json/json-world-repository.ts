import { World, Character, generateId } from "@repo/rp-lib";
import { WorldMetadata, IWorldRepository } from "storage/world-repository";
import { JSONEntityStorage } from "./json-storage";
import { EntityRecord } from "storage/entity";

export class JSONWorldRepository
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

  async getCharacter(worldId: World["id"], characterId: Character["id"]) {
    const { entity: world } = await this.getWorld(worldId);
    if (!world) {
      throw new Error("World not found");
    }

    return world.characters.find((c) => c.id === characterId);
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
      {
        entity: world,
        metadata: {
          description: "",
          imageUrl: "",
          wikiUrl: "",
          isPublicTemplate: false,
          createdUtc: new Date(),
        },
      },
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

  async getWorld(worldId: World["id"]) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === worldId);
    if (!entityData) {
      throw new Error("World not found");
    }

    return entityData;
  }
}

export const jsonWorldRepository = new JSONWorldRepository(
  "worlds",
  World,
  (worlds: unknown) => worlds as EntityRecord<World, WorldMetadata>[]
);
