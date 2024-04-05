import { DEFAULT_USER_ID } from "@/db/data";
import { actionsSchema } from "@/db/schema/actions";
import { classesSchema } from "@/db/schema/classes";
import { eq } from "drizzle-orm";
import { Actor, CampaignEventWithRound } from "roleplayer";
import { db } from "../db";
import { CampaignRecord, NewCampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import {
  CharacterRecord,
  charactersSchema,
  charactersToActionsSchema,
  charactersToCampaignsSchema,
} from "../db/schema/characters";
import { EventRecord, eventsSchema } from "../db/schema/events";
import { NewFriendInviteRecord, friendInvitesSchema } from "../db/schema/friend-invite";
import { UserRecord } from "../db/schema/users";
import { WorldRecord, worldsSchema } from "../db/schema/worlds";
import { CampaignAggregated, mapCampaignWorldData } from "./data-mapper";
import { WorldService } from "./world-service";

export class CampaignService {
  async getAll(userId: UserRecord["id"]): Promise<{ campaign: CampaignRecord; events: EventRecord[] }[]> {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .leftJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.userId, userId));

    const result = rows.reduce<Record<CampaignRecord["id"], { campaign: CampaignRecord; events: EventRecord[] }>>(
      (acc, row) => {
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
      },
      {}
    );

    return Object.values(result);
  }

  async getWorldCampaigns(worldId: WorldRecord["id"]) {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.worldId, worldId));

    const result = rows.reduce<Record<CampaignRecord["id"], { campaign: CampaignRecord; events: EventRecord[] }>>(
      (acc, row) => {
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
      },
      {}
    );

    return Object.values(result);
  }

  async createBattle(campaignId: CampaignRecord["id"]) {
    const campaignData = await this.getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("No such campaign");
    }

    const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, campaignData.worldId);
    if (!worldData) {
      throw new Error("No such campaign");
    }

    const { campaign } = mapCampaignWorldData(worldData, campaignData);

    campaign.startBattle();

    await this.saveCampaignEvents(campaign.id, campaign.events);

    const campaignState = roleplayer.getCampaignFromEvents();
    const battle = campaignState.getCurrentBattle();

    return { id: battle?.id };
  }

  async deleteCampaign(campaignId: CampaignRecord["id"]): Promise<void> {
    await db.delete(charactersToCampaignsSchema).where(eq(charactersToCampaignsSchema.campaignId, campaignId));
    await db.delete(eventsSchema).where(eq(eventsSchema.campaignId, campaignId));
    await db.delete(campaignsSchema).where(eq(campaignsSchema.id, campaignId));
  }

  async createCampaign(newCampaign: NewCampaignRecord): Promise<{ id: CampaignRecord["id"] }> {
    const rows = await db.insert(campaignsSchema).values(newCampaign).returning();

    const created = rows[0];
    if (!created) {
      throw new Error("Nothing inserted");
    }

    const campaignData = await this.getCampaign(created.id);
    if (!campaignData) {
      throw new Error("Cannot find campaign");
    }

    const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, campaignData.worldId);
    if (!worldData) {
      throw new Error("No such world");
    }

    const { campaign } = mapCampaignWorldData(worldData, campaignData);
    campaign.startCampaign();

    await this.saveCampaignEvents(campaign.id, campaign.events);

    return { id: created.id };
  }

  async getCampaign(campaignId: CampaignRecord["id"]) {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))

      // Join events
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))

      // Join world stuff
      .leftJoin(actionsSchema, eq(actionsSchema.worldId, worldsSchema.id))
      .leftJoin(classesSchema, eq(classesSchema.worldId, worldsSchema.id))

      // Join characters
      .leftJoin(charactersToCampaignsSchema, eq(charactersToCampaignsSchema.campaignId, campaignsSchema.id))
      .leftJoin(charactersSchema, eq(charactersToCampaignsSchema.characterId, charactersSchema.id))
      .leftJoin(charactersToActionsSchema, eq(charactersSchema.id, charactersToActionsSchema.characterId))

      .where(eq(campaignsSchema.id, campaignId));

    const result = rows.reduce<Record<CampaignRecord["id"], CampaignAggregated>>((acc, row) => {
      const campaignRow = row.campaigns;

      if (!acc[campaignRow.id]) {
        acc[campaignRow.id] = {
          ...campaignRow,
          world: {
            ...row.worlds,
            actions: [],
            campaigns: [],
            characters: [],
            races: [],
            classes: [],
            itemTemplates: [],
            statuses: [],
          },
          events: [],
          characters: [],
        };
      }

      const campaign = acc[campaignRow.id];

      if (row.events) {
        campaign!.events = [...campaign!.events.filter((c) => c.id !== row.events!.id), row.events];
      }

      if (row.characters) {
        campaign!.characters = [...campaign!.characters.filter((c) => c.id !== row.characters!.id), row.characters];
      }

      if (row.classes) {
        campaign!.world.classes = [...campaign!.world.classes.filter((c) => c.id !== row.classes!.id), row.classes];
      }

      return acc;
    }, {});

    return result[campaignId];
  }

  async getDemoCampaigns(): Promise<CampaignRecord[]> {
    return db
      .select()
      .from(campaignsSchema)
      .where((c) => eq(c.isDemo, true));
  }

  async saveCampaign(campaign: CampaignRecord) {}

  async saveCampaignEvents(campaignId: CampaignRecord["id"], events: CampaignEventWithRound[]) {
    await db
      .insert(eventsSchema)
      .values(
        events.map((e: any) => ({
          eventId: e.id,
          campaignId,
          serialNumber: e.serialNumber,
          characterId: e.characterId,
          roundId: e.roundId,
          battleId: e.battleId,
          eventData: JSON.stringify(e),
          type: e.type,
        }))
      )
      .onConflictDoUpdate({
        target: eventsSchema.eventId,
        set: {
          updatedUtc: new Date(),
        },
      });
  }

  async createFriendInvite(invite: NewFriendInviteRecord) {
    return await db.insert(friendInvitesSchema).values(invite).returning({ id: friendInvitesSchema.id });
  }

  async addCharacter(campaignId: CampaignRecord["id"], character: CharacterRecord) {
    await db.insert(charactersToCampaignsSchema).values({ campaignId, characterId: character.id });

    const campaignData = await this.getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("No such campaign");
    }

    const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, campaignData.worldId);
    if (!worldData) {
      throw new Error("No such world");
    }

    const { campaign } = mapCampaignWorldData(worldData, campaignData);

    campaign.createCharacter(character.id, character.name);

    await this.saveCampaignEvents(campaignData.id, campaign.events);
  }

  async updateCharacter(character: Actor) {
    const existing = await db.select().from(charactersSchema).where(eq(charactersSchema.id, character.id));
    if (!existing) {
      throw new Error("No such character");
    }
  }
}
