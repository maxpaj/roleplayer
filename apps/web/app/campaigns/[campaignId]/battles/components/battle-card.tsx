import { Card, CardHeader } from "@/components/ui/card";
import { Battle } from "@repo/rp-lib";
import Link from "next/link";

type BattleCardProps = {
  battle: Battle;
  campaignId: string;
};

export function BattleCard({ campaignId, battle }: BattleCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/battles/${battle.id}`}>
      <Card className="w-[100px] h-[100px]">
        <CardHeader className="p-2">{battle.name || "Current"}</CardHeader>
      </Card>
    </Link>
  );
}
