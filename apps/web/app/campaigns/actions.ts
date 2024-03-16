"use server";

import { CampaignService } from "services/campaign-service";
import { CampaignRecord } from "db/schema/campaigns";
import { UserRecord } from "db/schema/users";
import { redirect } from "next/navigation";
import { CampaignEventWithRound } from "roleplayer";
import { DEFAULT_USER_ID } from "@/db/data";

export async function createBattle(campaignId: CampaignRecord["id"]) {
  const battle = await new CampaignService().createBattle(campaignId);
  redirect(`/campaigns/${campaignId}/battles/${battle.id}`);
}

export async function deleteCampaign(id: CampaignRecord["id"]) {
  await new CampaignService().deleteCampaign(id);
}

export async function saveCampaignEvents(campaignId: CampaignRecord["id"], events: CampaignEventWithRound[]) {
  return await new CampaignService().saveCampaignEvents(campaignId, events);
}

export async function getCampaign(campaignId: CampaignRecord["id"]) {
  return await new CampaignService().getCampaign(campaignId);
}

export async function getCampaigns(userId: UserRecord["id"] = DEFAULT_USER_ID) {
  return await new CampaignService().getAll(userId);
}
