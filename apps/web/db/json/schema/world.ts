import { World } from "@repo/rp-lib";
import { JSONEntityId, JSONEntityRecord } from "./entity";

export type JSONWorldRecord = JSONEntityRecord<World> & {
  id: JSONEntityId;
  createdUtc: Date;
  isPublicTemplate: boolean;
  imageUrl: string;
  wikiUrl: string;
  description: string;
};
