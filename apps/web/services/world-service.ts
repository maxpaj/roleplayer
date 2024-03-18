import { eq } from "drizzle-orm";
import { db } from "../db";
import { ActionRecord, actionsSchema } from "../db/schema/actions";
import { CampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import { CharacterRecord, NewCharacterRecord, charactersSchema } from "../db/schema/characters";
import { ClazzRecord, NewClazzRecord, classesSchema } from "../db/schema/classes";
import { ItemRecord, NewItemRecord, itemsSchema } from "../db/schema/items";
import { MonsterRecord, NewMonsterRecord, monstersSchema, monstersToActionsSchema } from "../db/schema/monster";
import { StatusRecord, statusesSchema } from "../db/schema/statuses";
import { UserRecord } from "../db/schema/users";
import { NewWorldRecord, WorldRecord, worldsSchema } from "../db/schema/worlds";
import { CampaignService } from "./campaign-service";
import { DEFAULT_USER_ID } from "@/db/data";

export type WorldAggregated = {
  world: WorldRecord;
  campaigns: CampaignRecord[];
  monsters: MonsterAggregated[];
  characters: CharacterRecord[];
  statuses: StatusRecord[];
  items: ItemRecord[];
  classes: ClazzRecord[];
  actions: ActionRecord[];
};

export type MonsterAggregated = {
  monster: MonsterRecord;
  actions: ActionRecord[];
};

export class WorldService {
  async getAll(userId: UserRecord["id"] = DEFAULT_USER_ID): Promise<WorldRecord[]> {
    const query = db.select().from(worldsSchema);

    return query;
  }

  async getWorld(userId: UserRecord["id"], worldId: WorldRecord["id"]) {
    const rows = await db
      .select()
      .from(worldsSchema)
      .leftJoin(actionsSchema, eq(actionsSchema.worldId, worldsSchema.id))
      .leftJoin(campaignsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(classesSchema, eq(classesSchema.worldId, worldsSchema.id))
      .leftJoin(itemsSchema, eq(itemsSchema.worldId, worldsSchema.id))
      .leftJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .leftJoin(monstersToActionsSchema, eq(monstersToActionsSchema.monsterId, monstersSchema.id))
      .leftJoin(actionsSchema, eq(monstersToActionsSchema.monsterId, actionsSchema.id))
      .leftJoin(statusesSchema, eq(statusesSchema.worldId, worldsSchema.id))
      .where(eq(worldsSchema.id, worldId));

    const aggregated = rows.reduce<Record<WorldRecord["id"], WorldAggregated>>((acc, row) => {
      const world = row.worlds;

      if (!acc[world.id]) {
        acc[world.id] = {
          world,
          monsters: [],
          actions: [],
          campaigns: [],
          characters: [],
          classes: [],
          items: [],
          statuses: [],
        };
      }

      if (row.characters) {
        acc[world.id]!.characters = [...acc[world.id]!.characters.filter((c) => c.id !== row.characters!.id), row.characters];
      }

      if (row.monsters) {
        const existing = acc[world.id]!.monsters.filter((c) => c.monster.id !== row.monsters!.id)[0];
        const monsterToAdd: MonsterAggregated = {
          actions: existing?.actions || [],
          monster: existing?.monster || row.monsters,
        };

        if (row.actions) {
          monsterToAdd.actions = [...monsterToAdd.actions.filter((a) => a.id !== row.actions!.id), row.actions];
        }

        acc[world.id]!.monsters = [...acc[world.id]!.monsters.filter((c) => c.monster.id !== row.monsters!.id), monsterToAdd];
      }

      if (row.campaigns) {
        acc[world.id]!.campaigns = [...acc[world.id]!.campaigns.filter((c) => c.id !== row.campaigns!.id), row.campaigns];
      }

      if (row.statuses) {
        acc[world.id]!.statuses = [...acc[world.id]!.statuses.filter((c) => c.id !== row.statuses!.id), row.statuses];
      }

      if (row.items) {
        acc[world.id]!.items = [...acc[world.id]!.items.filter((c) => c.id !== row.items!.id), row.items];
      }

      if (row.actions) {
        acc[world.id]!.actions = [...acc[world.id]!.actions.filter((c) => c.id !== row.actions!.id), row.actions];
      }

      if (row.classes) {
        acc[world.id]!.classes = [...acc[world.id]!.classes.filter((c) => c.id !== row.classes!.id), row.classes];
      }

      return acc;
    }, {});

    const result = Object.values(aggregated);

    return result[0];
  }

  async deleteWorld(worldId: WorldRecord["id"]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createWorld(newWorldRecord: NewWorldRecord): Promise<{ id: WorldRecord["id"] }> {
    const rows = await db.insert(worldsSchema).values(newWorldRecord).returning({ id: worldsSchema.id });

    if (rows[0]) {
      return rows[0];
    }

    throw new Error("No rows inserted");
  }

  async createCharacter(character: NewCharacterRecord, campaignId?: CampaignRecord["id"]): Promise<{ id: CampaignRecord["id"] }> {
    const rows = await db.insert(charactersSchema).values(character).returning();
    const created = rows[0];

    if (!created) {
      throw new Error("No rows inserted");
    }

    if (campaignId) {
      await new CampaignService().addCharacter(campaignId, created);
    }

    return created;
  }

  async getTemplateWorlds(): Promise<WorldRecord[]> {
    const query = db.select().from(worldsSchema).where(eq(worldsSchema.isTemplate, true));

    return query;
  }

  async setWorldPublicVisibility(worldId: WorldRecord["id"], isPublic: boolean) {
    throw new Error("Method not implemented.");
  }

  async createWorldCharacter(character: NewCharacterRecord) {
    return db.insert(charactersSchema).values(character).returning({ id: charactersSchema.id });
  }

  async createMonster(monster: NewMonsterRecord) {
    return db.insert(monstersSchema).values(monster).returning({ id: monstersSchema.id });
  }

  async createItem(item: NewItemRecord) {
    return db.insert(itemsSchema).values(item).returning({ id: itemsSchema.id });
  }

  async createCharacterClass(clazz: NewClazzRecord) {
    return db.insert(classesSchema).values(clazz).returning({ id: classesSchema.id });
  }
}
