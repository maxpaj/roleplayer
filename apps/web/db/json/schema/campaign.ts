import { Campaign } from "@repo/rp-lib";
import { JSONEntityRecord } from "./entity";

export type JSONCampaignRecord = JSONEntityRecord<Campaign> & {
  isDemo: boolean;
  createdUtc: Date;
  imageUrl: string;
  description: string;
};
