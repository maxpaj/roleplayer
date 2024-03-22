import { Card, CardHeader } from "@/components/ui/card";
import { Battle } from "roleplayer";
import Link from "next/link";
import { CampaignRecord } from "@/db/schema/campaigns";

type BattleCardProps = {
  battle: Battle;
  campaignId: CampaignRecord["id"];
};

export function BattleCard({ campaignId, battle }: BattleCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/battles/${battle.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">{battle.name || "Current"}</CardHeader>
      </Card>
    </Link>
  );
}
