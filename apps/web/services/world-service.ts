import { db } from "../db";
import { eq } from "drizzle-orm";
import { CampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import { NewWorldRecord, WorldRecord, worldsSchema } from "../db/schema/worlds";
import {
  CharacterRecord,
  NewCharacterRecord,
  charactersSchema,
} from "../db/schema/characters";
import { UserRecord, usersSchema } from "../db/schema/users";
import {
  MonsterRecord,
  NewMonsterRecord,
  monstersSchema,
} from "../db/schema/monster";
import { StatusRecord, statusesSchema } from "../db/schema/statuses";
import { ActionRecord, actionsSchema } from "../db/schema/actions";
import {
  ClazzRecord,
  NewClazzRecord,
  classesSchema,
} from "../db/schema/classes";
import { ItemRecord, NewItemRecord, itemsSchema } from "../db/schema/items";
import { CampaignService } from "./campaign-service";

export type WorldAggregated = {
  world: WorldRecord;
  campaigns: CampaignRecord[];
  monsters: MonsterRecord[];
  characters: CharacterRecord[];
  statuses: StatusRecord[];
  items: ItemRecord[];
  classes: ClazzRecord[];
  actions: ActionRecord[];
};

export class WorldService {
  async getAll(userId: UserRecord["id"] = 2): Promise<WorldRecord[]> {
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
      .leftJoin(statusesSchema, eq(statusesSchema.worldId, worldsSchema.id))
      .where(eq(worldsSchema.id, worldId));

    const aggregated = rows.reduce<Record<number, WorldAggregated>>(
      (acc, row) => {
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
          acc[world.id]!.characters = [
            ...acc[world.id]!.characters.filter(
              (c) => c.id !== row.characters!.id
            ),
            row.characters,
          ];
        }

        if (row.monsters) {
          acc[world.id]!.monsters = [
            ...acc[world.id]!.monsters.filter((c) => c.id !== row.monsters!.id),
            row.monsters,
          ];
        }

        if (row.campaigns) {
          acc[world.id]!.campaigns = [
            ...acc[world.id]!.campaigns.filter(
              (c) => c.id !== row.campaigns!.id
            ),
            row.campaigns,
          ];
        }

        if (row.statuses) {
          acc[world.id]!.statuses = [
            ...acc[world.id]!.statuses.filter((c) => c.id !== row.statuses!.id),
            row.statuses,
          ];
        }

        if (row.items) {
          acc[world.id]!.items = [
            ...acc[world.id]!.items.filter((c) => c.id !== row.items!.id),
            row.items,
          ];
        }

        if (row.actions) {
          acc[world.id]!.actions = [
            ...acc[world.id]!.actions.filter((c) => c.id !== row.actions!.id),
            row.actions,
          ];
        }

        if (row.classes) {
          acc[world.id]!.classes = [
            ...acc[world.id]!.classes.filter((c) => c.id !== row.classes!.id),
            row.classes,
          ];
        }

        return acc;
      },
      {}
    );

    const result = Object.values(aggregated);

    return result[0];
  }

  async deleteWorld(worldId: WorldRecord["id"]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createWorld(newWorldRecord: NewWorldRecord): Promise<{ id: number }> {
    const rows = await db
      .insert(worldsSchema)
      .values(newWorldRecord)
      .returning({ id: worldsSchema.id });

    if (rows[0]) {
      return rows[0];
    }

    throw new Error("No rows inserted");
  }

  async createCharacter(
    character: NewCharacterRecord,
    campaignId?: CampaignRecord["id"]
  ): Promise<{ id: number }> {
    const rows = await db
      .insert(charactersSchema)
      .values(character)
      .returning();

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
    const query = db
      .select()
      .from(worldsSchema)
      .where(eq(worldsSchema.isTemplate, true));

    return query;
  }

  async setWorldPublicVisibility(
    worldId: WorldRecord["id"],
    isPublic: boolean
  ) {
    throw new Error("Method not implemented.");
  }

  async createWorldCharacter(character: NewCharacterRecord) {
    return db
      .insert(charactersSchema)
      .values(character)
      .returning({ id: charactersSchema.id });
  }

  async createMonster(monster: NewMonsterRecord) {
    return db
      .insert(monstersSchema)
      .values(monster)
      .returning({ id: monstersSchema.id });
  }

  async createItem(item: NewItemRecord) {
    return db
      .insert(itemsSchema)
      .values(item)
      .returning({ id: itemsSchema.id });
  }

  async createCharacterClass(clazz: NewClazzRecord) {
    return db
      .insert(classesSchema)
      .values(clazz)
      .returning({ id: classesSchema.id });
  }
}
