import { Campaign, World } from "@repo/rp-lib";
import { Character } from "@repo/rp-lib";
import { CampaignEventWithRound } from "@repo/rp-lib";
import { CampaignRecord } from "db/json/schema/campaign";
import { JSONUserRecord } from "db/json/schema/user";

export interface ICampaignRepository {
  getAll(): Promise<CampaignRecord[]>;
  deleteCampaign(campaignId: Campaign["id"]): Promise<void>;
  createCampaign(
    name: string,
    world: World["id"],
    adventurers: Character[],
    userId: JSONUserRecord["id"]
  ): Promise<Campaign>;
  getCampaign(campaignId: Campaign["id"]): Promise<CampaignRecord>;
  createCharacter(
    campaignId: Campaign["id"],
    name: string
  ): Promise<Character["id"]>;
  publishEvent(
    campaignId: Campaign["id"],
    event: CampaignEventWithRound
  ): Promise<Campaign>;
  getDemoCampaigns(): Promise<CampaignRecord[]>;
}
