"use server";

import { CampaignService } from "services/campaign-service";
import { CampaignRecord } from "db/schema/campaigns";
import { CharacterRecord } from "db/schema/characters";
import { UserRecord } from "db/schema/users";
import { WorldRecord } from "db/schema/worlds";
import { redirect } from "next/navigation";

export async function createBattle(campaignId: CampaignRecord["id"]) {
  const battleId = new CampaignService().createBattle(campaignId);
  redirect(`/campaigns/${campaignId}/battles/${battleId}`);
}

export async function deleteCampaign(id: CampaignRecord["id"]) {
  await new CampaignService().deleteCampaign(id);
}

export async function createCampaign(
  userId: UserRecord["id"],
  worldId: WorldRecord["id"],
  characters: CharacterRecord[]
) {
  const created = await new CampaignService().createCampaign({
    isDemo: false,
    userId,
    worldId,
    name: "My new campaign",
  });

  redirect(`/campaigns/${created.id}`);
}

export async function getCampaign(campaignId: CampaignRecord["id"]) {
  return await new CampaignService().getCampaign(campaignId);
}

export async function getCampaigns(userId: UserRecord["id"] = 2) {
  return await new CampaignService().getAll(userId);
}
