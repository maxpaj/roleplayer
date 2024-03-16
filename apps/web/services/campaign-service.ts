import { classesSchema } from "@/db/schema/classes";
import { eq } from "drizzle-orm";
import { Campaign, CampaignEventWithRound, CampaignState, DefaultRuleSet, World } from "roleplayer";
import { db } from "../db";
import { CampaignRecord, NewCampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import { CharacterRecord, charactersSchema, charactersToCampaignsSchema } from "../db/schema/characters";
import { EventRecord, eventsSchema } from "../db/schema/events";
import { NewFriendInviteRecord, friendInvitesSchema } from "../db/schema/friend-invite";
import { monstersSchema } from "../db/schema/monster";
import { UserRecord } from "../db/schema/users";
import { WorldRecord, worldsSchema } from "../db/schema/worlds";
import { WorldAggregated } from "./world-service";

export class CampaignService {
  async getAll(userId: UserRecord["id"]): Promise<{ campaign: CampaignRecord; events: EventRecord[] }[]> {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .leftJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.userId, userId));

    const result = rows.reduce<Record<CampaignRecord["id"], { campaign: CampaignRecord; events: EventRecord[] }>>((acc, row) => {
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

    const result = rows.reduce<Record<CampaignRecord["id"], { campaign: CampaignRecord; events: EventRecord[] }>>((acc, row) => {
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
    const campaignData = await this.getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("No such campaign");
    }

    const world = new World({
      ...campaignData.world.world,
      ruleset: DefaultRuleSet,
    });

    const campaign = new Campaign({
      ...campaignData.campaign,
      world,
      events: campaignData.events.map((e) => e.eventData) as CampaignEventWithRound[],
    });

    campaign.startBattle();

    await this.saveCampaignEvents(campaign.id, campaign.events);

    const campaignState = campaign.getCampaignStateFromEvents();
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

    const campaign = new Campaign({
      ...campaignData.campaign,
      world: new World({
        ...campaignData.world.world,
        ruleset: DefaultRuleSet,
      }),
    });

    await this.saveCampaignEvents(campaign.id, campaign.events);

    return { id: created.id };
  }

  async getCampaign(campaignId: CampaignRecord["id"]) {
    const rows = await db
      .select()
      .from(campaignsSchema)
      .innerJoin(worldsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(classesSchema, eq(classesSchema.worldId, worldsSchema.id))
      .leftJoin(charactersToCampaignsSchema, eq(charactersToCampaignsSchema.campaignId, campaignsSchema.id))
      .leftJoin(charactersSchema, eq(charactersToCampaignsSchema.characterId, charactersSchema.id))
      .leftJoin(eventsSchema, eq(eventsSchema.campaignId, campaignsSchema.id))
      .where(eq(campaignsSchema.id, campaignId));

    const result = rows.reduce<
      Record<
        CampaignRecord["id"],
        {
          campaign: CampaignRecord;
          events: EventRecord[];
          characters: CharacterRecord[];
          world: WorldAggregated;
        }
      >
    >((acc, row) => {
      const campaign = row.campaigns;
      if (!acc[campaign.id]) {
        acc[campaign.id] = {
          world: {
            world: row.worlds,
            actions: [],
            campaigns: [],
            characters: [],
            classes: [],
            items: [],
            monsters: [],
            statuses: [],
          },
          campaign,
          events: [],
          characters: [],
        };
      }

      if (row.events) {
        acc[campaign.id]!.events = [...acc[campaign.id]!.events.filter((c) => c.id !== row.events!.id), row.events];
      }

      if (row.characters) {
        acc[campaign.id]!.characters = [...acc[campaign.id]!.characters.filter((c) => c.id !== row.characters!.id), row.characters];
      }

      if (row.monsters) {
        acc[campaign.id]!.world.monsters = [...acc[campaign.id]!.world.monsters.filter((c) => c.id !== row.monsters!.id), row.monsters];
      }

      if (row.classes) {
        acc[campaign.id]!.world.classes = [...acc[campaign.id]!.world.classes.filter((c) => c.id !== row.classes!.id), row.classes];
      }

      return acc;
    }, {});

    return result[campaignId];
  }

  async publishEvent(campaignId: CampaignRecord["id"], event: Event): Promise<CampaignRecord> {
    throw new Error("Method not implemented.");
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

    const { campaign, events } = campaignData;

    // Roleplayer-lib realm start
    const world = new World({
      ...campaignData.world.world,
      ruleset: DefaultRuleSet,
    });

    const c = new Campaign({
      ...campaign,
      world,
      events: events.map((e) => e.eventData) as CampaignEventWithRound[],
    });

    c.createCharacter(character.id, character.name);

    await this.saveCampaignEvents(campaign.id, c.events);
  }
}
