import {
  Campaign,
  CampaignEventWithRound,
  Character,
  World,
  generateId,
} from "@repo/rp-lib";
import {
  CampaignMetadata,
  ICampaignRepository,
} from "storage/campaign-repository";
import { EntityRecord } from "storage/entity";
import { JSONEntityStorage } from "storage/json/json-storage";
import { jsonWorldRepository } from "./json-world-repository";

export class JSONCampaignRepository
  extends JSONEntityStorage<Campaign, CampaignMetadata>
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

  async getCharacter(campaignId: Campaign["id"], characterId: Character["id"]) {
    const { entity: campaign } = await this.getCampaign(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const data = campaign.applyEvents();

    return data.characters.find((c) => c.id === characterId);
  }

  async createCharacter(campaignId: Campaign["id"], name: string) {
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

  async deleteCampaign(id: Campaign["id"]) {
    const campaigns = await this.getAll();
    const removed = campaigns.filter((c) => c.entity.id !== id);
    await this.saveCampaigns(removed);
  }

  async saveCampaigns(campaigns: EntityRecord<Campaign, CampaignMetadata>[]) {
    this.write(
      campaigns.map((c) => {
        delete c.entity.world;
        return c;
      })
    );
  }

  async getAll(): Promise<EntityRecord<Campaign, CampaignMetadata>[]> {
    const campaigns = await this.read();
    const withWorlds = await Promise.all(
      campaigns.map(async (c) => {
        const worldRecord = await jsonWorldRepository.getWorld(
          c.entity.worldId
        );

        c.entity.world = worldRecord.entity;

        return {
          entity: c.entity,
          metadata: c.metadata,
        };
      })
    );

    return withWorlds;
  }

  async getDemoCampaigns(): Promise<
    EntityRecord<Campaign, CampaignMetadata>[]
  > {
    const all = await this.getAll();
    return all.filter((w) => w.metadata.isDemo);
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
        entity: campaign,
        metadata: {
          description: "",
          imageUrl: "",
          isDemo: false,
          createdUtc: new Date(),
        },
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

  async getCampaign(id: Campaign["id"]) {
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
    return campaigns as EntityRecord<Campaign, CampaignMetadata>[];
  }
);
