import { Dice } from "../dice/dice";
import { Status } from "./status";

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
  effectElement: ElementType;
  effectType: EffectType;
  amountVariable?: Dice;
  amountStatic?: number;
};

export enum EffectType {
  HealthGain = "HealthGain",
  HealthLoss = "HealthLoss",
  StatusGain = "StatusGain",
  StatusLoss = "StatusLoss",
}
