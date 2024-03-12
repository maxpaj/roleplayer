import { Id } from "../../../lib/generate-id";
import { Effect } from "./effect";

export enum StatusApplicationTrigger {
  Always = "Always",
  RoundStart = "RoundStart",
  RoundEnd = "RoundEnd",
}

export type Status = {
  id: Id;
  name: string;
  type: StatusType;
  appliesEffects: {
    effect: Effect;
    appliesAt: StatusApplicationTrigger;
  }[];
  durationType: StatusDurationType;
  durationRounds?: number;
};

export enum StatusType {
  Curse = "Curse",
  Poison = "Poison",
  Magic = "Magic",
  Physical = "Physical",
}

export enum StatusDurationType {
  Forever = "Forever",
  UntilLongRest = "UntilLongRest",
  UntilShortRest = "UntilShortRest",
  NumberOfRounds = "NumberOfRounds",
}
