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
import {
  Campaign,
  CampaignEventWithRound,
  DefaultRuleSet,
  World,
} from "roleplayer";
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
    const campaignData = await this.getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("No such campaign");
    }

    const world = new World({
      ...campaignData.world,
      ruleset: DefaultRuleSet,
    });

    const campaign = new Campaign({
      ...campaignData.campaign,
      world,
      events: campaignData.events.map(
        (e) => e.eventData
      ) as CampaignEventWithRound[],
    });

    campaign.startBattle();

    await this.saveCampaignEvents(campaign.id, campaign.events);

    const battle = campaign.getCurrentBattle();

    return { id: battle?.id };
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
      .returning();

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
      world: new World({ ...campaignData.world, ruleset: DefaultRuleSet }),
    });

    await db.insert(eventsSchema).values(
      campaign.events.map((e: any) => ({
        campaignId: created.id,
        characterId: e.characterId,
        roundId: e.roundId,
        battleId: e.battleId,
        eventData: JSON.stringify(e),
        type: e.type,
      }))
    );

    return { id: created.id };
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
        acc[campaign.id]!.events = [
          ...acc[campaign.id]!.events.filter((c) => c.id !== row.events!.id),
          row.events,
        ];
      }

      if (row.characters) {
        acc[campaign.id]!.characters = [
          ...acc[campaign.id]!.characters.filter(
            (c) => c.id !== row.characters!.id
          ),
          row.characters,
        ];
      }

      return acc;
    }, {});

    return result[campaignId];
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
    await db.insert(eventsSchema).values(
      events.map((e: any) => ({
        campaignId,
        characterId: e.characterId,
        roundId: e.roundId,
        battleId: e.battleId,
        eventData: JSON.stringify(e),
        type: e.type,
      }))
    );
  }

  async createFriendInvite(invite: NewFriendInviteRecord) {
    return await db
      .insert(friendInvitesSchema)
      .values(invite)
      .returning({ id: friendInvitesSchema.id });
  }

  async addCharacter(campaignId: number, character: CharacterRecord) {
    await db
      .insert(charactersToCampaignsSchema)
      .values({ campaignId, characterId: character.id });

    const campaignData = await this.getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("No such campaign");
    }

    const { campaign, events } = campaignData;

    // Roleplayer-lib realm start
    const world = new World({
      ...campaignData.world,
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