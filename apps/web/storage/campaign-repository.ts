import { Campaign, CampaignEventWithRound } from "@repo/rp-lib/campaign";
import { Character } from "@repo/rp-lib/character";
import { JSONStorage } from "./json-storage";
import { generateId } from "@repo/rp-lib/id";
import z from "zod";

export interface ICampaignRepository {
  getAll(): Promise<Campaign[]>;
  deleteCampaign(campaignId: Campaign["id"]): Promise<void>;
  createCampaign(name: string): Promise<Campaign>;
  getCampaign(campaignId: Campaign["id"]): Promise<Campaign | undefined>;
  createCharacter(
    campaignId: Campaign["id"],
    name: string
  ): Promise<Character["id"]>;
  publishEvent(
    campaignId: Campaign["id"],
    event: CampaignEventWithRound
  ): Promise<Campaign>;
}

export class MemoryCampaignRepository
  extends JSONStorage<Campaign>
  implements ICampaignRepository
{
  async updateCharacter(
    campaignId: Campaign["id"],
    characterId: Character["id"],
    update: Partial<Character>
  ) {
    const campaigns = await this.getAll();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (update.name) {
      campaign.events.push({
        characterId,
        id: generateId(),
        type: "CharacterChangedName",
        name: update.name,
        roundId: campaign.getCurrentRound().id,
      });
    }

    if (update.classes) {
      const classUpdates = update.classes.map((c) => ({
        characterId,
        id: generateId(),
        type: "CharacterClassGain" as "CharacterClassGain",
        roundId: campaign.getCurrentRound().id,
        classId: c.clazz.id,
      }));

      campaign.events.push(...classUpdates);
    }

    this.write(campaigns);
  }

  async createBattle(campaignId: string) {
    const campaigns = await this.getAll();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const battleId = generateId();

    campaign.events.push({
      id: generateId(),
      type: "BattleStarted",
      battleId,
      roundId: generateId(),
    });

    return battleId;
  }

  async publishEvent(
    campaignId: Campaign["id"],
    event: CampaignEventWithRound
  ): Promise<Campaign> {
    const campaigns = await this.getAll();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    campaign.events.push(event);
    await this.write(campaigns);
    return campaign;
  }

  async getCharacter(campaignId: Campaign["id"], characterId: Character["id"]) {
    const campaign = await this.getCampaign(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    return campaign.characters.find((c) => c.id === characterId);
  }

  async createCharacter(campaignId: Campaign["id"], name: string) {
    const campaigns = await this.getAll();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const characterId = generateId();

    campaign.events.push({
      type: "CharacterSpawned",
      characterId,
      id: generateId(),
      roundId: campaign.getCurrentRound().id,
      battleId: campaign.getCurrentBattle()?.id,
    });

    campaign.events.push({
      type: "CharacterChangedName",
      name: name,
      characterId,
      id: generateId(),
      roundId: campaign.getCurrentRound().id,
      battleId: campaign.getCurrentBattle()?.id,
    });

    await this.write(campaigns);

    return characterId;
  }

  async deleteCampaign(id: Campaign["id"]) {
    const campaigns = await this.read();
    const removed = campaigns.filter((c) => c.id !== id);
    await this.write(removed);
  }

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
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) {
      throw new Error("Could not find campaign");
    }

    campaign.applyEvents();

    return campaign;
  }
}

const validate = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
      events: z.array(z.any()),
      characters: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    })
  )
  .transform((data) => data.map((d) => new Campaign(d)));

export const memoryCampaignRepository = new MemoryCampaignRepository(
  "campaigns",
  Campaign,
  (campaigns: unknown) => campaigns as Campaign[]
);
