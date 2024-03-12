import { Actor, BattleEntity } from "roleplayer";
import { ReactNode } from "react";

export type ActorRecord = Actor & {
  renderPortrait(): ReactNode;
};

export type BattleEntityRecord = BattleEntity & {
  getImageUrl(): string;
};
