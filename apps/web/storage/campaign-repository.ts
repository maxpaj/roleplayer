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
      campaign.setCharacterName(characterId, update.name);
    }

    if (update.classes) {
      campaign.setCharacterClasses(characterId, update.classes);
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

    const data = campaign.applyEvents();

    return data.characters.find((c) => c.id === characterId);
  }

  async createCharacter(campaignId: Campaign["id"], name: string) {
    const campaigns = await this.getAll();
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const characterId = generateId();
    campaign.createCharacter(characterId, name);

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

export const memoryCampaignRepository = new MemoryCampaignRepository(
  "campaigns",
  Campaign,
  (campaigns: unknown) => campaigns as Campaign[]
);
