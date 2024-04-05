"use server";

import { DEFAULT_USER_ID } from "@/db/data";
import { ItemDefinitionRecord } from "@/db/schema/items";
import { WorldRecord } from "@/db/schema/worlds";
import { GenerationService } from "services/open-ai-service";
import { UserService } from "services/user-service";
import { WorldService } from "services/world-service";

export async function saveWorld(worldId: WorldRecord["id"], world: Partial<WorldRecord>) {
  await new WorldService().saveWorld(worldId, world);
}

export async function saveItem(itemId: ItemDefinitionRecord["id"], update: Partial<ItemDefinitionRecord>) {
  await new WorldService().saveItem(itemId, update);
}

export async function generateItemDescription(worldId: WorldRecord["id"], itemId: ItemDefinitionRecord["id"]) {
  const world = await new WorldService().getWorld(DEFAULT_USER_ID, worldId);
  if (!world) {
    throw new Error("No such world");
  }

  const item = world.itemTemplates.find((c) => c.id === itemId);
  if (!item) {
    throw new Error("No such item");
  }

  const user = await new UserService().getUser(DEFAULT_USER_ID);
  const generated = await new GenerationService().getItemDescription(world, item, user);

  return generated?.message.content!;
}
