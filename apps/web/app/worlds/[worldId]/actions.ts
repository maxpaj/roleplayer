"use server";

import { Character, World } from "roleplayer";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";
import { WorldRepository } from "@/db/repository/drizzle-world-repository";
import { redirect } from "next/navigation";
import { WorldRecord } from "@/db/schema/worlds";
import { CharacterRecord } from "@/db/schema/characters";
import { ItemRecord } from "@/db/schema/items";
import { StatusRecord } from "@/db/schema/statuses";
import { MonsterRecord } from "@/db/schema/monster";
import { NewCampaignRecord } from "@/db/schema/campaigns";

type WorldData = {
  world: WorldRecord;
  characters: CharacterRecord[];
  items: ItemRecord[];
  statuses: StatusRecord[];
  monsters: MonsterRecord[];
};

export async function getWorldData(
  id: World["id"]
): Promise<WorldData | undefined> {
  const worldData = await new WorldRepository().getWorld(0, id);

  if (!worldData[0]) {
    return undefined;
  }

  const items = worldData.reduce((sum, curr) => {
    if (!curr.items) {
      return sum;
    }

    return [...sum, curr.items];
  }, [] as ItemRecord[]);

  const characters = worldData.reduce((sum, curr) => {
    if (!curr.characters) {
      return sum;
    }

    return [...sum, curr.characters];
  }, [] as CharacterRecord[]);

  const statuses = worldData.reduce((sum, curr) => {
    if (!curr.statuses) {
      return sum;
    }

    return [...sum, curr.statuses];
  }, [] as StatusRecord[]);

  const monsters = worldData.reduce((sum, curr) => {
    if (!curr.monsters) {
      return sum;
    }

    return [...sum, curr.monsters];
  }, [] as MonsterRecord[]);

  return {
    world: worldData[0].worlds,
    items,
    characters,
    statuses,
    monsters,
  };
}

export async function getWorldCampaigns(id: World["id"]) {
  return await new CampaignRepository().getWorldCampaigns(id);
}

export async function deleteWorld(id: World["id"]) {
  await new WorldRepository().deleteWorld(id);
}

export async function unpublishWorld(id: World["id"]) {
  await new WorldRepository().setWorldPublicVisibility(id, false);
}

export async function publishWorld(id: World["id"]) {
  await new WorldRepository().setWorldPublicVisibility(id, true);
}

export async function createCampaign(
  worldId: World["id"],
  newCampaign: NewCampaignRecord
) {
  const worldData = await new WorldRepository().getWorld(0, worldId);
  if (!worldData[0]) {
    throw new Error("Cannot find world");
  }

  const created = await new CampaignRepository().createCampaign(newCampaign);
  redirect(`/campaigns/${created.id}`);
}
