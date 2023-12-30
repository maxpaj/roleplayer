import { Effect } from "./effect";

export enum StatusApplicationTrigger {
  Always = "Always",
  RoundStart = "RoundStart",
  RoundEnd = "RoundEnd",
}

export type Status = {
  name: string;
  type: StatusType;
  appliesEffectAt: StatusApplicationTrigger;
  appliesEffect: Effect;
  durationType: StatusDurationType;
  durationAmount: number;
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
