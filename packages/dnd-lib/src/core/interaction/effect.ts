import { Id } from "../../lib/generate-id";
import { Dice } from "../dice/dice";

export enum ElementType {
  Slashing = "Slashing",
  Piercing = "Piercing",
  Bludgeoning = "Bludgeoning",
  Poison = "Poison",
  Acid = "Acid",
  Fire = "Fire",
  Cold = "Cold",
  Radiant = "Radiant",
  Necrotic = "Necrotic",
  Lightning = "Lightning",
  Thunder = "Thunder",
  Force = "Force",
  Psychic = "Psychic",
}

export type Effect = {
  type: EffectType;
  element: ElementType;
  amountVariable?: Dice;
  amountStatic?: number;
  appliesStatusId?: Id;
};

export enum EffectType {
  StatusGain = "StatusGain",
  StatusLoss = "StatusLoss",
  HealthLoss = "HealthLoss",
  HealthGain = "HealthGain",
}
