import { Character } from "@repo/rp-lib";
import { JSONCharacterRecord } from "db/json/schema/character";

export interface ICharacterRepository {
  getAll(): Promise<JSONCharacterRecord[]>;
  deleteCharacter(campaignId: Character["id"]): Promise<void>;
  getCharacter(campaignId: Character["id"]): Promise<JSONCharacterRecord>;
  createCharacter(
    campaignId: Character["id"],
    name: string
  ): Promise<Character["id"]>;
}
