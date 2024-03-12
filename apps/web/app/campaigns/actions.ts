"use server";

import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";
import { CampaignRecord } from "db/schema/campaigns";
import { CharacterRecord } from "db/schema/characters";
import { UserRecord } from "db/schema/users";
import { WorldRecord } from "db/schema/worlds";
import { redirect } from "next/navigation";

export async function createBattle(campaignId: CampaignRecord["id"]) {
  const battleId = new CampaignRepository().createBattle(campaignId);
  redirect(`/campaigns/${campaignId}/battles/${battleId}`);
}

export async function createCampaign(
  userId: UserRecord["id"],
  worldId: WorldRecord["id"],
  characters: CharacterRecord[]
) {
  const created = await new CampaignRepository().createCampaign({
    isDemo: false,
    userId,
    worldId,
    name: "My new campaign",
  });

  redirect(`/campaigns/${created.id}`);
}

export async function getCampaign(campaignId: CampaignRecord["id"]) {
  return await new CampaignRepository().getCampaign(campaignId);
}

export async function getCampaigns(userId: UserRecord["id"]) {
  return await new CampaignRepository().getAll(userId);
}
