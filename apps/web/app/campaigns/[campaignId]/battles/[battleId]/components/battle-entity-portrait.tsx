import { BattleEntity } from "@repo/rp-lib";
import { ReactNode } from "react";

export type BattleEntityRecord = {
  entity: BattleEntity;
  imageUrl: string;
  renderPortrait(): ReactNode;
};

export function BattleEntityPortrait({
  entity,
}: {
  entity: BattleEntityRecord;
}) {
  return <></>;
}
