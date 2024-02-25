"use server";

import { redirect } from "next/navigation";
import { memoryCampaignRepository } from "../../../storage/campaign-repository";

export async function getCampaign(id: string) {
  const campaign = await memoryCampaignRepository.getCampaign(id);
  return campaign;
}

export async function deleteCampaign(id: string) {
  await memoryCampaignRepository.deleteCampaign(id);
  redirect("/campaigns/");
}
