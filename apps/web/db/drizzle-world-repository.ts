import { db } from ".";
import { eq, and } from "drizzle-orm";
import { campaignsSchema } from "./schema/campaigns";
import { NewWorldRecord, WorldRecord, worldsSchema } from "./schema/worlds";
import { charactersSchema } from "./schema/characters";
import { UserRecord } from "./schema/users";
import { monstersSchema } from "./schema/monster";
import { statusesSchema } from "./schema/statuses";
import { actionsSchema } from "./schema/actions";
import { classessSchema } from "./schema/classes";

export class WorldRepository {
  async getAll(userId: UserRecord["id"]): Promise<WorldRecord[]> {
    const query = db
      .select()
      .from(worldsSchema)
      .where(eq(worldsSchema.userId, userId));

    return query;
  }

  async getWorld(userId: UserRecord["id"], worldId: WorldRecord["id"]) {
    return db
      .select()
      .from(worldsSchema)
      .innerJoin(campaignsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .innerJoin(monstersSchema, eq(monstersSchema.worldId, worldsSchema.id))
      .innerJoin(statusesSchema, eq(statusesSchema.worldId, worldsSchema.id))
      .innerJoin(classessSchema, eq(classessSchema.worldId, worldsSchema.id))
      .innerJoin(actionsSchema, eq(actionsSchema.worldId, worldsSchema.id))
      .innerJoin(
        charactersSchema,
        eq(charactersSchema.campaignId, campaignsSchema.id)
      )
      .where(
        and(eq(worldsSchema.userId, userId), eq(worldsSchema.id, worldId))
      );
  }

  deleteWorld(worldId: WorldRecord["id"]): Promise<void> {
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

  createCharacter(worldId: WorldRecord["id"], name: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getTemplateWorlds(): Promise<WorldRecord[]> {
    const query = db
      .select()
      .from(worldsSchema)
      .where(eq(worldsSchema.isTemplate, true));

    return query;
  }
}
