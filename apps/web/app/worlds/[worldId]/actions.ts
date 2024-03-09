"use server";

import { Character, World } from "@repo/rp-lib";
import { redirect } from "next/navigation";
import { jsonCampaignRepository } from "db/json/json-campaign-repository";
import { jsonWorldRepository } from "db/json/json-world-repository";

export async function getWorld(id: World["id"]) {
  const world = await jsonWorldRepository.getWorld(id);
  return world;
}

export async function getWorldCampaigns(id: World["id"]) {
  const campaigns = await jsonCampaignRepository.getWorldCampaigns(id);
  return campaigns;
}

export async function deleteWorld(id: World["id"]) {
  await jsonWorldRepository.deleteWorld(id);
}

export async function unpublishWorld(id: World["id"]) {
  await jsonWorldRepository.setWorldPublicVisibility(id, false);
}

export async function publishWorld(id: World["id"]) {
  await jsonWorldRepository.setWorldPublicVisibility(id, true);
}

export async function createCampaign(
  worldId: World["id"],
  characters: Character[]
) {
  const world = await jsonWorldRepository.getWorld(worldId);
  const created = await jsonCampaignRepository.createCampaign(
    "",
    world.entity.id,
    characters
  );
  redirect(`/campaigns/${created.id}`);
}
