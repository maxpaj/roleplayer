import { Id } from "../../lib/generate-id";
import { EventGenerator } from "./effect";

/**
 * @module core/actions
 */
export enum StatusApplicationTrigger {
  Always = "Always",
  RoundStart = "RoundStart",
  RoundEnd = "RoundEnd",
}

/**
 * @module core/actions
 */
export type StatusDefinition = {
  id: Id;
  name: string;
  type: StatusType;
  appliesEffects: {
    effect: EventGenerator;
    appliesAt: StatusApplicationTrigger;
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
  Forever = "Forever",
  UntilLongRest = "UntilLongRest",
  UntilShortRest = "UntilShortRest",
  NumberOfRounds = "NumberOfRounds",
}
