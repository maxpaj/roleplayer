import { Id } from "../../lib/generate-id";
import { CharacterResourceDefinition } from "../ruleset/ruleset";
import { EffectEvent } from "./effect";

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
  appliesEffects: EffectEvent[];
  eligibleTargets: TargetType[];
  rangeDistanceUnits: number;
  requiresResources: {
    resourceTypeId: CharacterResourceDefinition["id"];
    amount: number;
  }[];
};
