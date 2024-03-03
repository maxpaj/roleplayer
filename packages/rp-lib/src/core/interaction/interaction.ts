import { Id } from "../../lib/generate-id";
import { CharacterResourceType } from "../character/character";
import { Effect } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

/**
 * Represents an interaction.
 */
export type Interaction = {
  id: Id;
  name: string;
  appliesEffects: Effect[];
  eligibleTargets: TargetType[];
  rangeDistanceMeters: number;
  requiresResources: {
    resourceId: CharacterResourceType["id"];
    amount: number;
  }[];
};
