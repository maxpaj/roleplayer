"use server";

import { Campaign, Character, World } from "@repo/rp-lib";
import { redirect } from "next/navigation";
import { jsonCampaignRepository } from "storage/json/json-campaign-repository";
import { jsonWorldRepository } from "storage/json/json-world-repository";

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

export async function getCampaign(campaignId: Campaign["id"]) {
  const all = await jsonCampaignRepository.getAll();
  return all.find((c) => c.entity.id === campaignId);
}

export async function getCampaigns() {
  return await jsonCampaignRepository.getAll();
}
