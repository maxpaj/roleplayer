import { Id } from "../../lib/generate-id";
import { CharacterResourceDefinition } from "../ruleset/ruleset";
import { EventGenerator } from "./effect";

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
  appliesEffects: EventGenerator[];
  eligibleTargets: TargetType[];
  rangeDistanceUnit: number;
  requiresResources: {
    resourceTypeId: CharacterResourceDefinition["id"];
    amount: number;
  }[];
};
