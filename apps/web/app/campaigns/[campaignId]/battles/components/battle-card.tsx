import { Battle } from "@repo/rp-lib";

type BattleCardProps = {
  battle: Battle;
};

export function BattleCard({ battle }: BattleCardProps) {
  return <>{battle.name}</>;
}
