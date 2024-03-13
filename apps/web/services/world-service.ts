import { db } from "../db";
import { eq } from "drizzle-orm";
import { CampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import { NewWorldRecord, WorldRecord, worldsSchema } from "../db/schema/worlds";
import {
  CharacterRecord,
  NewCharacterRecord,
  charactersSchema,
  charactersToCampaignsSchema,
} from "../db/schema/characters";
import { UserRecord, usersSchema } from "../db/schema/users";
import {
  MonsterRecord,
  NewMonsterRecord,
  monstersSchema,
} from "../db/schema/monster";
import { StatusRecord, statusesSchema } from "../db/schema/statuses";
import { ActionRecord, actionsSchema } from "../db/schema/actions";
import { ClazzRecord, classesSchema } from "../db/schema/classes";
import { ItemRecord, NewItemRecord, itemsSchema } from "../db/schema/items";

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

    const aggregated = rows.reduce<
      Record<
        number,
        {
          world: WorldRecord;
          campaigns: CampaignRecord[];
          monsters: MonsterRecord[];
          characters: CharacterRecord[];
          statuses: StatusRecord[];
          items: ItemRecord[];
          classes: ClazzRecord[];
          actions: ActionRecord[];
        }
      >
    >((acc, row) => {
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
        acc[world.id]!.characters.push(row.characters);
      }

      if (row.monsters) {
        acc[world.id]!.monsters.push(row.monsters);
      }

      if (row.campaigns) {
        acc[world.id]!.campaigns.push(row.campaigns);
      }

      if (row.statuses) {
        acc[world.id]!.statuses.push(row.statuses);
      }

      if (row.items) {
        acc[world.id]!.items.push(row.items);
      }

      if (row.actions) {
        acc[world.id]!.actions.push(row.actions);
      }

      return acc;
    }, {});

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

    await db
      .insert(usersSchema)
      .values([
        {
          name: "Max",
        },
      ])
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
      .returning({ id: charactersSchema.id });

    const created = rows[0];

    if (!created) {
      throw new Error("No rows inserted");
    }

    if (campaignId) {
      console.log("Adding char to campaign", campaignId);

      await db
        .insert(charactersToCampaignsSchema)
        .values({ campaignId, characterId: created.id });
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
}
