import type { RoleplayerEvent } from "../..";
import type { Id } from "../../lib/generate-id";
import type { EffectEventDefinition } from "./effect";

/**
 * @module core/actions
 */
export type StatusDefinition = {
  id: Id;
  name: string;
  type: StatusType;
  appliesEffects: {
    effect: EffectEventDefinition;
    appliesAt: RoleplayerEvent["type"];
  }[];
  durationType: StatusDurationType;
  duration?: number;
};

/**
 * @module core/actions
 */
export enum StatusType {
  Curse = "Curse",
  Poison = "Poison",
  Magic = "Magic",
  Physical = "Physical",
}

/**
 * @module core/actions
 */
export enum StatusDurationType {
  Permanent = "Permanent",
  UntilLongRest = "UntilLongRest",
  UntilShortRest = "UntilShortRest",
  NumberOfRounds = "NumberOfRounds",
}
