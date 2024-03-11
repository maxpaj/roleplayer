import { EntityRecord } from "models/entity";
import { db } from ".";
import { eq } from "drizzle-orm";
import {
  CampaignRecord,
  NewCampaignRecord,
  campaignsSchema,
} from "./schema/campaigns";
import { worldsSchema } from "./schema/worlds";
import { monstersSchema } from "./schema/monster";
import { charactersSchema } from "./schema/characters";
import { UserRecord } from "./schema/users";
import { EventRecord, eventsSchema } from "./schema/events";

export class CampaignRepository {
  async getAll(
    userId: UserRecord["id"]
  ): Promise<{ campaign: CampaignRecord; events: EventRecord[] }[]> {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .innerJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .innerJoin(
        charactersSchema,
        eq(charactersSchema.campaignId, campaignsSchema.id)
      )
      .innerJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.userId, userId));

    const result = rows.reduce<
      Record<number, { campaign: CampaignRecord; events: EventRecord[] }>
    >((acc, row) => {
      const campaign = row.campaign;
      if (!acc[campaign.id]) {
        acc[campaign.id] = { campaign, events: [] };
      }

      const event = row.event;
      if (event) {
        acc[campaign.id]!.events.push(event);
      }

      return acc;
    }, {});

    return Object.values(result);
  }

  async createBattle(campaignId: number) {
    throw new Error("Method not implemented.");
  }

  async deleteCampaign(campaignId: CampaignRecord["id"]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createCampaign(
    newCampaign: NewCampaignRecord
  ): Promise<CampaignRecord> {
    throw new Error("Method not implemented.");
  }

  async getCampaign(campaignId: CampaignRecord["id"]): Promise<CampaignRecord> {
    throw new Error("Method not implemented.");
  }

  async createCharacter(
    campaignId: CampaignRecord["id"],
    name: string
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async publishEvent(
    campaignId: CampaignRecord["id"],
    event: Event
  ): Promise<CampaignRecord> {
    throw new Error("Method not implemented.");
  }

  async getDemoCampaigns(): Promise<EntityRecord<CampaignRecord>[]> {
    throw new Error("Method not implemented.");
  }
}
