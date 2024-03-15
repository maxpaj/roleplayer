import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { CharacterRecord } from "@/db/schema/characters";
import { CampaignRecord } from "@/db/schema/campaigns";

type CampaignCharacterCardProps = {
  character: CharacterRecord;
  campaignId: CampaignRecord["id"];
};

export function CampaignCharacterCard({ campaignId, character }: CampaignCharacterCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/characters/${character.id}`}>
      <Card className="h-[100px] w-[150px]">
        <CardHeader className="p-2">{character.name || "Current"}</CardHeader>
      </Card>
    </Link>
  );
}
