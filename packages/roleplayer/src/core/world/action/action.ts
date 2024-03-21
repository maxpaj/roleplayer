import { Id } from "../../../lib/generate-id";
import { Actor } from "../../actor/character";
import { CharacterResourceType } from "../../ruleset/ruleset";
import { Effect } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

/**
 * Represents an action, with targets, and some effect that will be applied
 */
export type ActionDefinition = {
  id: Id;
  name: string;
  description: string;
  appliesEffects: Effect[];
  eligibleTargets: TargetType[];
  rangeDistanceUnit: number;
  requiresResources: {
    resourceTypeId: CharacterResourceType["id"];
    amount: number;
  }[];
};

export type Action = {
  actionId: ActionDefinition["id"];
  targetId: Actor["id"];
};
