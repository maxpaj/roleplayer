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

    this.write(campaigns);
  }

  async createBattle(campaignId: string) {
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignId);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

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
    const entities = await this.getAll();
    const entityData = entities.find((c) => c.entity.id === campaignId);
    if (!entityData) {
      throw new Error("Campaign not found");
    }
    const { entity: campaign } = entityData;

    campaign.events.push(event);

    await this.write(entities);
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

    await this.write(entities);

    return characterId;
  }

  async deleteCampaign(id: Campaign["id"]) {
    const campaigns = await this.read();
    const removed = campaigns.filter((c) => c.entity.id !== id);
    await this.write(removed);
  }

  async getAll(): Promise<EntityRecord<Campaign, CampaignMetadata>[]> {
    return this.read();
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

    const campaigns = await this.read();

    this.write([
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

    await this.write(entities);
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
    const world = await jsonWorldRepository.getWorld(worldId);

    const withWorlds = await Promise.all(
      records
        .filter((r) => (r.entity.world as unknown as World["id"]) === worldId)
        .map(async (r) => {
          return {
            ...r,
            entity: {
              ...r.entity,
              world: world.entity,
            },
          };
        })
    );

    return withWorlds.filter((c) => c.entity.world.id === worldId);
  }
}

export const jsonCampaignRepository = new JSONCampaignRepository(
  "campaigns",
  Campaign,
  (campaigns: unknown) =>
    campaigns as EntityRecord<Campaign, CampaignMetadata>[]
);
