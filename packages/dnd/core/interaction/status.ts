export enum StatusApply {
  Always = "Always",
  RoundStart = "RoundStart",
  RoundEnd = "RoundEnd",
}

export type Status = {
  name: string;
  effects: {
    appliesAt: StatusApply;
    effect: [];
  }[];
  durationType: StatusDurationType;
  duration: number;
  type: StatusType;
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
