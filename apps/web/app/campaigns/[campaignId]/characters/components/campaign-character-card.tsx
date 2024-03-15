import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { CharacterRecord } from "@/db/schema/characters";

type CampaignCharacterCardProps = {
  character: CharacterRecord;
  campaignId: number;
};

export function CampaignCharacterCard({
  campaignId,
  character,
}: CampaignCharacterCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/characters/${character.id}`}>
      <Card className="w-[150px] h-[100px]">
        <CardHeader className="p-2">{character.name || "Current"}</CardHeader>
      </Card>
    </Link>
  );
}
