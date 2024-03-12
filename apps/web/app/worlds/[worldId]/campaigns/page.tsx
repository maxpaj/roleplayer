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

      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c.entity} />
      ))}

      {campaigns.length === 0 && <Muted>No campaigns started yet.</Muted>}
    </>
  );
}
