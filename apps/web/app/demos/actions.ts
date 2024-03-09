"use server";

import { Campaign } from "@repo/rp-lib";
import { jsonCampaignRepository } from "db/json/json-campaign-repository";

export async function getCampaign(campaignId: Campaign["id"]) {
  const all = await jsonCampaignRepository.getAll();
  return all.find((c) => c.entity.id === campaignId);
}

export async function getDemoCampaigns() {
  const campaigns = await jsonCampaignRepository.getDemoCampaigns();
  return campaigns;
}
