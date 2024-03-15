import { H2 } from "@/components/ui/typography";
import { BadgeLink } from "@/components/ui/button-link";
import { getCampaign } from "../actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

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

  const { campaign, world } = campaignData;

  return (
    <div>
      <div className="flex justify-between gap-x-4 flex-wrap mb-4">
        <H2>{campaign.name}</H2>
      </div>

      {world.world.imageUrl && (
        <div className="fixed w-full h-[800px] -z-10 opacity-15 top-0 left-0">
          <div
            className="relative w-full h-full z-10"
            style={{
              backgroundImage: `linear-gradient(transparent 75%, hsl(var(--background)) 100%)`,
            }}
          />

          <Image
            className="relative z-0"
            src={world.world.imageUrl}
            fill={true}
            style={{ objectFit: "cover" }}
            alt={"World background"}
          />
        </div>
      )}

      <div className="flex mb-8 justify-between flex-wrap gap-1">
        <div className="flex gap-2 flex-wrap">
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
