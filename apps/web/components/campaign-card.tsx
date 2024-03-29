import Link from "next/link";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { RemoveFunctions } from "types/without-functions";
import { CampaignRecord } from "@/db/schema/campaigns";

type CampaignCardProps = {
  campaign: RemoveFunctions<CampaignRecord>;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{campaign.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
