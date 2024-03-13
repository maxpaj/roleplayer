"use server";

import { CampaignService } from "services/campaign-service";

export async function getDemoCampaigns() {
  return await new CampaignService().getDemoCampaigns();
}
