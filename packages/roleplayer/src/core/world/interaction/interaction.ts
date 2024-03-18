import { Id } from "../../../lib/generate-id";
import { CharacterResourceType } from "../../actor/character";
import { Effect } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

/**
 * Represents an interaction, with targets, and some effect that will be applied
 */
export type Interaction = {
  id: Id;
  name: string;
  description: string;
  appliesEffects: Effect[];
  eligibleTargets: TargetType[];
  rangeDistanceMeters: number;
  requiresResources: {
    resourceTypeId: CharacterResourceType["id"];
    amount: number;
  }[];
};
