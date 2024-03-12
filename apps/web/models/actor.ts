import { Actor, BattleActor } from "roleplayer";
import { ReactNode } from "react";

export type ActorRecord = Actor & {
  renderPortrait(): ReactNode;
};

export type BattleEntityRecord = BattleActor & {
  getImageUrl(): string;
};
