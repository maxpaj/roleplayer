import { Id } from "../../lib/generate-id";
import { EventGenerator } from "./effect";

export enum StatusApplicationTrigger {
  Always = "Always",
  RoundStart = "RoundStart",
  RoundEnd = "RoundEnd",
}

export type StatusDefinition = {
  id: Id;
  name: string;
  type: StatusType;
  appliesEffects: {
    effect: EventGenerator;
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
