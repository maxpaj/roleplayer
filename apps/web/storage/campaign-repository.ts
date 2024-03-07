import { Campaign, World } from "@repo/rp-lib";
import { Character } from "@repo/rp-lib";
import { CampaignEventWithRound } from "@repo/rp-lib";
import { EntityRecord } from "./entity";

export type CampaignMetadata = {
  isDemo: boolean;
  createdUtc: Date;
  imageUrl: string;
  description: string;
};

export type CampaignStorageType = EntityRecord<Campaign, CampaignMetadata>;

export interface ICampaignRepository {
  getAll(): Promise<CampaignStorageType[]>;
  deleteCampaign(campaignId: Campaign["id"]): Promise<void>;
  createCampaign(
    name: string,
    world: World["id"],
    adventurers: Character[]
  ): Promise<Campaign>;
  getCampaign(campaignId: Campaign["id"]): Promise<CampaignStorageType>;
  createCharacter(
    campaignId: Campaign["id"],
    name: string
  ): Promise<Character["id"]>;
  publishEvent(
    campaignId: Campaign["id"],
    event: CampaignEventWithRound
  ): Promise<Campaign>;
  getDemoCampaigns(): Promise<EntityRecord<Campaign, CampaignMetadata>[]>;
}
