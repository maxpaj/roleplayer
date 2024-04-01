import { Id } from "../../lib/generate-id";
import { CharacterResourceDefinition } from "../ruleset/ruleset";
import { EffectEventGeneratorType } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

// TODO: Can this be typed better?
export type EffectParameters<T extends EffectEventGeneratorType> = Record<string, unknown>;

export type EffectApply = {
  eventType: EffectEventGeneratorType;
  parameters: EffectParameters<EffectEventGeneratorType>;
};

/**
 * @module core/actions
 *
 * Represents an action, with targets, and some effect that will be applied
 */
export type ActionDefinition = {
  id: Id;
  name: string;
  description: string;
  appliesEffects: EffectApply[];
  eligibleTargets: TargetType[];
  rangeDistanceUnits: number;
  requiresResources: {
    resourceTypeId: CharacterResourceDefinition["id"];
    amount: number;
  }[];
};
