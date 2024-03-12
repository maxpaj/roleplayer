"use server";

import { Character, World } from "roleplayer";
import { CampaignRepository } from "db/drizzle-campaign-repository";
import { WorldRepository } from "db/drizzle-world-repository";
import { redirect } from "next/navigation";

export async function getWorld(id: World["id"]) {
  const world = await new WorldRepository().getWorld(id);
  return world;
}

export async function getWorldCampaigns(id: World["id"]) {
  const campaigns = await new CampaignRepository().getWorldCampaigns(id);
  return campaigns;
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
  characters: Character[]
) {
  const world = await new WorldRepository().getWorld(worldId);
  const created = await new CampaignRepository().createCampaign(
    "",
    world.id,
    characters
  );
  redirect(`/campaigns/${created.id}`);
}
