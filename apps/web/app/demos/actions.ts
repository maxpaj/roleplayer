"use server";

import { Campaign } from "roleplayer";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";

export async function getCampaign(campaignId: Campaign["id"]) {
  return await new CampaignRepository().getAll(2);
}

export async function getDemoCampaigns() {
  const campaigns = await new CampaignRepository().getDemoCampaigns();
  return campaigns;
}
