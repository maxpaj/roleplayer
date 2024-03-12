import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";
import { getWorldCampaigns } from "../actions";
import { CampaignCard } from "@/components/campaign-card";

export default async function CampaignsPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const campaigns = await getWorldCampaigns(parseInt(id));

  return (
    <>
      <H3>Campaigns</H3>
      <Muted>List of campaigns started from this world</Muted>
      <Separator className="my-3" />

      <div className="flex gap-2">
        {campaigns.map((c) => (
          <CampaignCard key={c.campaign.id} campaign={c.campaign} />
        ))}
      </div>

      {campaigns.length === 0 && <Muted>No campaigns started yet.</Muted>}
    </>
  );
}
