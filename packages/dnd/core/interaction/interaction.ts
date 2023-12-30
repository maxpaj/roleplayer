import { Effect } from "./effect";

export enum TargetType {
  Self = "Self",
  Character = "Character",
  Friendly = "Friendly",
  Hostile = "Hostile",
  Environment = "Environment",
}

export enum InteractionType {
  Drink = "Drink",
  Throw = "Throw",
  Attack = "Attack",
  Push = "Push",
  Open = "Open",
}

/**
 * Represents an interaction.
 */
export type Interaction = {
  type: InteractionType;
  name: string;
  appliesEffects: Effect[];
  eligibleTargets: TargetType[];
  rangeDistanceMeters: number;
};
