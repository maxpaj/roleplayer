import {
  Campaign,
  CampaignEventWithRound,
  Character,
  World,
  generateId,
} from "@repo/rp-lib";
import { ICampaignRepository } from "repository/campaign-repository";
import { JSONEntityStorage } from "db/json";
import { jsonWorldRepository } from "./json-world-repository";
import { generateEntityId } from "db/json/schema/entity";
import { JSONCampaignRecord } from "db/json/schema/campaign";

export class JSONCampaignRepository
  extends JSONEntityStorage<JSONCampaignRecord>
  implements ICampaignRepository
{
  async updateCharacter(
    campaignId: Campaign["id"],
    characterId: Character["id"],
    update: Partial<Character>
  ) {
    const campaigns = await this.getAll();
    const campaignData = campaigns.find((c) => c.entity.id === campaignId);
    if (!campaignData) {
      throw new Error("Campaign not found");
    }

    const { entity: campaign } = campaignData;

    if (update.name) {
      campaign.setCharacterName(characterId, update.name);
    }

    if (update.classes) {
      campaign.setCharacterClasses(characterId, update.classes);
    }

    this.saveCampaigns(campaigns);
  }

  async createBattle(campaignId: string) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignId);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    const battleId = campaign.startBattle();
    await this.saveCampaigns(entities);
    return battleId;
  }

  async publishEvent(
    campaignId: Campaign["id"],
    event: CampaignEventWithRound
  ): Promise<Campaign> {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignId);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    campaign.events.push(event);

    await this.saveCampaigns(entities);
    return campaign;
  }

  async getCharacter(
    campaignId: JSONCampaignRecord["id"],
    characterId: Character["id"]
  ) {
    const { entity: campaign } = await this.getCampaign(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const data = campaign.applyEvents();

    return data.characters.find((c) => c.id === characterId);
  }

  async createCharacter(campaignId: JSONCampaignRecord["id"], name: string) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignId);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    const characterId = generateId();
    campaign.createCharacter(characterId, name);

    await this.saveCampaigns(entities);

    return characterId;
  }

  async deleteCampaign(id: JSONCampaignRecord["id"]) {
    const campaigns = await this.getAll();
    const removed = campaigns.filter((c) => c.entity.id !== id);
    await this.saveCampaigns(removed);
  }

  async saveCampaigns(campaigns: JSONCampaignRecord[]) {
    this.write(
      campaigns.map((c) => {
        delete c.entity.world;
        return c;
      })
    );
  }

  async getAll(): Promise<JSONCampaignRecord[]> {
    const campaigns = await this.read();
    const withWorlds = await Promise.all(
      campaigns.map(async (c) => {
        const worldRecord = await jsonWorldRepository.getWorld(
          c.entity.worldId
        );

        c.entity.world = worldRecord.entity;

        return {
          ...c,
          entity: c.entity,
        };
      })
    );

    return withWorlds;
  }

  async getDemoCampaigns(): Promise<JSONCampaignRecord[]> {
    const all = await this.getAll();
    return all.filter((w) => w.isDemo);
  }

  async createCampaign(
    name: string,
    worldId: World["id"],
    adventurers: Character[]
  ) {
    const campaign = new Campaign({
      id: generateId(),
      name,
      world: worldId as unknown as World,
      adventurers,
    });

    const campaigns = await this.getAll();

    this.saveCampaigns([
      ...campaigns,
      {
        id: generateEntityId(),
        entity: campaign,
        description: "",
        imageUrl: "",
        isDemo: false,
        createdUtc: new Date(),
      },
    ]);

    return campaign;
  }

  async saveCampaign(campaignUpdate: Campaign) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignUpdate.id);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    Object.assign(campaign, campaignUpdate);

    await this.saveCampaigns(entities);
  }

  async getCampaign(id: JSONCampaignRecord["id"]) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === id);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    campaign.applyEvents();

    return entityData;
  }

  async getWorldCampaigns(worldId: World["id"]) {
    const records = await this.getAll();
    return records.filter((c) => c.entity.worldId === worldId);
  }
}

export const jsonCampaignRepository = new JSONCampaignRepository(
  "campaigns",
  Campaign,
  (campaigns: unknown) => {
    return campaigns as JSONCampaignRecord[];
  }
);
