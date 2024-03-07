import { World } from "@repo/rp-lib";
import { Character } from "@repo/rp-lib";
import { EntityRecord } from "./entity";

export type WorldMetadata = {
  createdUtc: Date;
  isPublicTemplate: boolean;
  imageUrl: string;
  wikiUrl: string;
  description: string;
};

export type WorldStorageType = EntityRecord<World, WorldMetadata>;

export interface IWorldRepository {
  getAll(): Promise<WorldStorageType[]>;
  deleteWorld(worldId: World["id"]): Promise<void>;
  createWorld(name: string): Promise<World>;
  getWorld(worldId: World["id"]): Promise<WorldStorageType>;
  createCharacter(worldId: World["id"], name: string): Promise<Character["id"]>;
}
