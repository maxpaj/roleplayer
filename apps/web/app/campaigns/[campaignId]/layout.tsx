import { H2 } from "@/components/ui/typography";
import { BadgeLink, ButtonLink } from "@/components/ui/button-link";
import { getCampaign } from "../actions";

export default async function CampaignLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignData = await getCampaign(parseInt(id));

  if (!campaignData) {
    return <>Campaign not found</>;
  }

  const { campaign } = campaignData;

  return (
    <div>
      <div className="flex justify-between gap-x-4 flex-wrap mb-4">
        <H2>{campaign.name}</H2>
      </div>

      <div className="flex mb-8 justify-between flex-wrap gap-1">
        <div className="flex gap-1 flex-wrap">
          <BadgeLink href={`/campaigns/${campaign.id}`}>Overview</BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/battles`}>
            Battles
          </BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/characters`}>
            Characters
          </BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/events`}>
            Events
          </BadgeLink>
        </div>
        <BadgeLink href={`/campaigns/${campaign.id}/settings`}>
          Settings
        </BadgeLink>
      </div>

      {children}
    </div>
  );
}
