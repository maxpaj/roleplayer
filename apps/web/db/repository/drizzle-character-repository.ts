import { db } from "..";
import { eq } from "drizzle-orm";
import { CharacterRecord, charactersSchema } from "../schema/characters";
import { classesSchema } from "../schema/classes";

export class CharacterRepository {
  async getCharacter(characterId: CharacterRecord["id"]) {
    const data = await db
      .select()
      .from(charactersSchema)
      .where(eq(classesSchema.id, characterId));

    return data;
  }
}
