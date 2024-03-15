import { DEFAULT_USER_ID, db } from "../db";
import { eq } from "drizzle-orm";
import { NewUserRecord, UserRecord, usersSchema } from "../db/schema/users";
import { NewCharacterRecord, charactersSchema } from "../db/schema/characters";
import { friendInvitesSchema } from "../db/schema/friend-invite";

export class UserService {
  async getAll(userId: UserRecord["id"] = DEFAULT_USER_ID): Promise<UserRecord[]> {
    const query = db.select().from(usersSchema);
    return query;
  }

  async getUser(userId: UserRecord["id"]): Promise<UserRecord> {
    const data = await db.select().from(usersSchema).where(eq(usersSchema.id, userId));

    if (!data[0]) {
      throw new Error("No user");
    }

    return data[0];
  }

  async deleteUser(userId: UserRecord["id"]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createUser(newUserRecord: NewUserRecord): Promise<{ id: UserRecord["id"] }> {
    const rows = await db.insert(usersSchema).values(newUserRecord).returning({ id: usersSchema.id });

    await db
      .insert(usersSchema)
      .values([
        {
          name: "Max",
        },
      ])
      .returning({ id: usersSchema.id });

    if (rows[0]) {
      return rows[0];
    }

    throw new Error("No rows inserted");
  }

  async createUserCharacter(character: NewCharacterRecord) {
    return db.insert(charactersSchema).values(character).returning({ id: charactersSchema.id });
  }

  async getFriendInvites(userId: UserRecord["id"]) {
    const data = await db
      .select()
      .from(friendInvitesSchema)
      .innerJoin(usersSchema, eq(usersSchema.id, friendInvitesSchema.userId))
      .where(eq(usersSchema.id, userId));

    return data;
  }
}
