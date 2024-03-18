import { H2 } from "@/components/ui/typography";
import { BadgeLink } from "@/components/ui/button-link";
import { getCampaign } from "../actions";
import Image from "next/image";

export default async function CampaignLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    return <>Campaign not found</>;
  }

  const { world } = campaign;

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-x-4">
        <H2>{campaign.name}</H2>
      </div>

      {world.imageUrl && (
        <div className="fixed left-0 top-0 -z-10 h-[800px] w-full opacity-15">
          <div
            className="relative z-10 h-full w-full"
            style={{
              backgroundImage: `linear-gradient(transparent 75%, hsl(var(--background)) 100%)`,
            }}
          />

          <Image
            className="relative z-0"
            src={world.imageUrl}
            fill={true}
            style={{ objectFit: "cover" }}
            alt={"World background"}
          />
        </div>
      )}

      <div className="mb-8 flex flex-wrap justify-between gap-1">
        <div className="flex flex-wrap gap-2">
          <BadgeLink href={`/campaigns/${campaign.id}`}>Overview</BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/battles`}>Battles</BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/characters`}>Characters</BadgeLink>
          <BadgeLink href={`/campaigns/${campaign.id}/events`}>Events</BadgeLink>
        </div>
        <BadgeLink href={`/campaigns/${campaign.id}/settings`}>Settings</BadgeLink>
      </div>

      {children}
    </div>
  );
}
