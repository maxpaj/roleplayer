import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  CampaignRecord,
  NewCampaignRecord,
  campaignsSchema,
} from "../db/schema/campaigns";
import { WorldRecord, worldsSchema } from "../db/schema/worlds";
import { monstersSchema } from "../db/schema/monster";
import {
  CharacterRecord,
  charactersSchema,
  charactersToCampaignsSchema,
} from "../db/schema/characters";
import { UserRecord } from "../db/schema/users";
import { EventRecord, eventsSchema } from "../db/schema/events";
import { CampaignEventWithRound } from "roleplayer";
import {
  NewFriendInviteRecord,
  friendInvitesSchema,
} from "../db/schema/friend-invite";

export class CampaignService {
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

  async getWorldCampaigns(worldId: WorldRecord["id"]) {
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

  async getCampaign(campaignId: CampaignRecord["id"]) {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(
        charactersToCampaignsSchema,
        eq(charactersToCampaignsSchema.campaignId, campaignsSchema.id)
      )
      .leftJoin(
        charactersSchema,
        eq(charactersToCampaignsSchema.characterId, charactersSchema.id)
      )
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.id, campaignId));

    const result = rows.reduce<
      Record<
        number,
        {
          campaign: CampaignRecord;
          events: EventRecord[];
          characters: CharacterRecord[];
          world: WorldRecord;
        }
      >
    >((acc, row) => {
      const campaign = row.campaigns;
      if (!acc[campaign.id]) {
        acc[campaign.id] = {
          world: row.worlds,
          campaign,
          events: [],
          characters: [],
        };
      }

      if (row.events) {
        acc[campaign.id]!.events.push(row.events);
      }

      if (row.characters) {
        acc[campaign.id]!.characters.push(row.characters);
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

  async createFriendInvite(invite: NewFriendInviteRecord) {
    return await db
      .insert(friendInvitesSchema)
      .values(invite)
      .returning({ id: friendInvitesSchema.id });
  }
}
