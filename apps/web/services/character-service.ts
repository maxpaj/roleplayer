import { db } from "../db";
import { eq } from "drizzle-orm";
import { CharacterRecord, charactersSchema } from "../db/schema/characters";
import { classesSchema } from "../db/schema/classes";

export class CharacterService {
  async getCharacter(characterId: CharacterRecord["id"]) {
    const data = await db
      .select()
      .from(charactersSchema)
      .where(eq(classesSchema.id, characterId));

    return data;
  }
}
