import { Campaign } from "@repo/dnd-lib/campaign";
import { JSONStorage } from "./json-storage";
import z from "zod";

export interface ICampaignRepository {
  getAll(): Promise<Campaign[]>;
  createCampaign(name: string): Promise<Campaign>;
  getCampaign(id: Campaign["id"]): Promise<Campaign | undefined>;
}

export class MemoryCampaignRepository
  extends JSONStorage<Campaign>
  implements ICampaignRepository
{
  async getAll(): Promise<Campaign[]> {
    return this.read();
  }

  async createCampaign(name: string) {
    const campaign = new Campaign({
      name,
    });
    const campaigns = await this.read();
    this.write([...campaigns, campaign]);
    return campaign;
  }

  async getCampaign(id: Campaign["id"]) {
    const campaigns = await this.read();
    return campaigns.find((c) => c.id === id);
  }
}

const validate = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  )
  .transform((data) => data.map((d) => new Campaign(d)));

export const memoryCampaignRepository = new MemoryCampaignRepository(
  "campaigns",
  Campaign,
  validate.parse
);
