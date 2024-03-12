import { db } from "..";
import { eq } from "drizzle-orm";
import {
  CampaignRecord,
  NewCampaignRecord,
  campaignsSchema,
} from "../schema/campaigns";
import { WorldRecord, worldsSchema } from "../schema/worlds";
import { monstersSchema } from "../schema/monster";
import { charactersSchema } from "../schema/characters";
import { UserRecord } from "../schema/users";
import { EventRecord, eventsSchema } from "../schema/events";
import { CampaignEventWithRound } from "roleplayer";

export class CampaignRepository {
  async getAll(
    userId: UserRecord["id"]
  ): Promise<{ campaign: CampaignRecord; events: EventRecord[] }[]> {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .leftJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.userId, userId));

    const result = rows.reduce<
      Record<number, { campaign: CampaignRecord; events: EventRecord[] }>
    >((acc, row) => {
      const campaign = row.campaigns;

      if (!campaign) {
        return acc;
      }

      if (!acc[campaign.id]) {
        acc[campaign.id] = { campaign, events: [] };
      }

      const event = row.events;
      if (event) {
        acc[campaign.id]!.events.push(event);
      }

      return acc;
    }, {});

    return Object.values(result);
  }

  async getWorldCampaigns(id: number) {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .leftJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id));

    const result = rows.reduce<
      Record<number, { campaign: CampaignRecord; events: EventRecord[] }>
    >((acc, row) => {
      const campaign = row.campaigns;
      if (!campaign) {
        return acc;
      }

      if (!acc[campaign.id]) {
        acc[campaign.id] = { campaign, events: [] };
      }

      const event = row.events;
      if (event) {
        acc[campaign.id]!.events.push(event);
      }

      return acc;
    }, {});

    return Object.values(result);
  }

  async createBattle(campaignId: CampaignRecord["id"]) {
    throw new Error("Method not implemented.");
  }

  async deleteCampaign(campaignId: CampaignRecord["id"]): Promise<void> {
    await db.delete(campaignsSchema).where(eq(campaignsSchema.id, campaignId));
  }

  async createCampaign(
    newCampaign: NewCampaignRecord
  ): Promise<{ id: number }> {
    const rows = await db
      .insert(campaignsSchema)
      .values(newCampaign)
      .returning({ id: campaignsSchema.id });

    if (rows[0]) {
      return rows[0];
    }

    throw new Error("No rows inserted");
  }

  async getCampaign(
    campaignId: CampaignRecord["id"]
  ): Promise<
    | { campaign: CampaignRecord; events: EventRecord[]; world: WorldRecord }
    | undefined
  > {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.id, campaignId));

    const result = rows.reduce<
      Record<
        number,
        { campaign: CampaignRecord; events: EventRecord[]; world: WorldRecord }
      >
    >((acc, row) => {
      const campaign = row.campaigns;
      if (!acc[campaign.id]) {
        acc[campaign.id] = { campaign, events: [], world: row.worlds };
      }

      if (row.events) {
        acc[campaign.id]!.events.push(row.events);
      }

      return acc;
    }, {});

    return result[campaignId];
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

  async getDemoCampaigns(): Promise<CampaignRecord[]> {
    return db
      .select()
      .from(campaignsSchema)
      .where((c) => eq(c.isDemo, true));
  }

  async saveCampaign(campaign: CampaignRecord) {}

  async saveCampaignEvents(
    campaignId: CampaignRecord["id"],
    events: CampaignEventWithRound[]
  ) {
    throw new Error("Method not implemented.");
  }
}
