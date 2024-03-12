import { db } from "..";
import { eq } from "drizzle-orm";
import { CampaignRecord, campaignsSchema } from "../schema/campaigns";
import { NewWorldRecord, WorldRecord, worldsSchema } from "../schema/worlds";
import { CharacterRecord, charactersSchema } from "../schema/characters";
import { UserRecord, usersSchema } from "../schema/users";
import { MonsterRecord, monstersSchema } from "../schema/monster";
import { StatusRecord, statusesSchema } from "../schema/statuses";
import { ActionRecord, actionsSchema } from "../schema/actions";
import { ClazzRecord, classesSchema } from "../schema/classes";
import { ItemRecord, itemsSchema } from "../schema/items";

export class WorldRepository {
  async getAll(userId: UserRecord["id"] = 2): Promise<WorldRecord[]> {
    const query = db.select().from(worldsSchema);

    return query;
  }

  async getWorld(
    userId: UserRecord["id"],
    worldId: WorldRecord["id"]
  ): Promise<
    {
      campaigns: CampaignRecord | null;
      characters: CharacterRecord | null;
      classes: ClazzRecord | null;
      worlds: WorldRecord;
      monsters: MonsterRecord | null;
      items: ItemRecord | null;
      actions: ActionRecord | null;
      statuses: StatusRecord | null;
    }[]
  > {
    const data = await db
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

    return data;
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
    worldId: WorldRecord["id"],
    name: string
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getTemplateWorlds(): Promise<WorldRecord[]> {
    const query = db
      .select()
      .from(worldsSchema)
      .where(eq(worldsSchema.isTemplate, true));

    return query;
  }

  async setWorldPublicVisibility(id: number, arg1: boolean) {
    throw new Error("Method not implemented.");
  }
}
