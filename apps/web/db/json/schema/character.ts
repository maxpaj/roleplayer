import { Character } from "@repo/rp-lib";
import { JSONEntityRecord, JSONEntityId } from "db/json/schema/entity";

export type JSONCharacterRecord = JSONEntityRecord<Character> & {
  id: JSONEntityId;
  createdUtc: Date;
  imageUrl: string;
  description: string;
  character: Character;
};
