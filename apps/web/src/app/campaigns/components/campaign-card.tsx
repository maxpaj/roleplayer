import { Campaign } from "@repo/dnd-lib/campaign";
import Link from "next/link";

type CampaignCardProps = { campaign: Campaign };

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="border border-slate-500 p-3 hover-border-slate-100">
        {campaign.name}
        <div className="text-xs">
          Created on {campaign.createdUtc.toUTCString()}
        </div>
      </div>
    </Link>
  );
}
