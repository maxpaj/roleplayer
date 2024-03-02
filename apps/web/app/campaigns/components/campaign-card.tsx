import Link from "next/link";
import { Campaign } from "@repo/rp-lib/world";

type CampaignCardProps = { campaign: Campaign };

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="border border-slate-500 p-3 hover-border-slate-100">
        {campaign.name}
      </div>
    </Link>
  );
}
