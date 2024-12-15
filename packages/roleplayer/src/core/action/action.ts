import type { Id } from "../../lib/generate-id";
import type { ResourceDefinition } from "../ruleset/ruleset";
import type { EffectEventDefinition } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

/**
 * @module core/actions
 *
 * Represents an action, with targets, and some effect that will be applied
 */
export type ActionDefinition = {
  id: Id;
  name: string;
  description: string;
  appliesEffects: EffectEventDefinition[];
  eligibleTargets: TargetType[];
  rangeDistanceUnits: number;
  requiresResources: {
    resourceTypeId: ResourceDefinition["id"];
    amount: number;
  }[];
};
