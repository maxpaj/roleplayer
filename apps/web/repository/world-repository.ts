import { World } from "@repo/rp-lib";
import { Character } from "@repo/rp-lib";
import { JSONWorldRecord } from "../db/json/schema/world";
import { JSONUserRecord } from "db/json/schema/user";

export interface IWorldRepository {
  getAll(): Promise<JSONWorldRecord[]>;
  deleteWorld(worldId: World["id"]): Promise<void>;
  createWorld(name: string, userId: JSONUserRecord["id"]): Promise<World>;
  getWorld(worldId: World["id"]): Promise<JSONWorldRecord>;
  createCharacter(worldId: World["id"], name: string): Promise<Character["id"]>;
}
