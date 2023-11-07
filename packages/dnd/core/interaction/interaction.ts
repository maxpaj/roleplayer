import { Effect } from "./effect";
import { Status } from "./status";

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
  name: string;
  type: InteractionType;
  effects: Effect[];
  appliesStatuses: Status[];
  eligibleTargets: TargetType[];
  rangeDistanceMeters: number;
};
