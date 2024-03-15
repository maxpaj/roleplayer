import { Card, CardHeader } from "@/components/ui/card";
import { CampaignRecord } from "@/db/schema/campaigns";
import Link from "next/link";
import { Actor } from "roleplayer";

type BattleActorCardProps = {
  campaignId: CampaignRecord["id"];
  actor: Actor;
};

export function BattleActorCard({ campaignId, actor }: BattleActorCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/characters/${actor.id}`}>
      <Card className="w-[150px] h-[100px]">
        <CardHeader className="p-2">{actor.name || "Current"}</CardHeader>
      </Card>
    </Link>
  );
}
