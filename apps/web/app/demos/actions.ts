"use server";

import { Campaign } from "roleplayer";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";

export async function getCampaign(campaignId: Campaign["id"]) {
  const all = await new CampaignRepository().getAll();
  return all.find((c) => c.id === campaignId);
}

export async function getDemoCampaigns() {
  const campaigns = await new CampaignRepository().getDemoCampaigns();
  return campaigns;
}
