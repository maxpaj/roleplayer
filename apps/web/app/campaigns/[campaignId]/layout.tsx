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
  const record = await getCampaign(id);

  if (!record) {
    return <>Not found!</>;
  }

  const { entity: campaign } = record;

  return (
    <div>
      <div className="flex justify-between gap-x-4 flex-wrap mb-4">
        <H2>{campaign.name}</H2>

        <div className="flex gap-x-2">
          <ButtonLink href={`/campaigns/${campaign.id}/battles`}>
            Start battle
          </ButtonLink>
        </div>
      </div>

      <div className="flex mb-8 justify-between flex-wrap">
        <div className="flex gap-1">
          <BadgeLink href={`/campaigns/${campaign.id}`}>Campaign</BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/battles`}>
            Battles
          </BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/characters`}>
            Characters
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
