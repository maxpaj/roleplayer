import { H2, Muted, Paragraph } from "@/components/ui/typography";
import { getCampaigns } from "./actions";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignLayoutHeader } from "./components/campaign-layout-header";

export const dynamic = "force-dynamic";

export default async function CampaignPage() {
  const campaigns = await getCampaigns();

  return (
    <div>
      <CampaignLayoutHeader />

      {campaigns.length === 0 && (
        <Paragraph>Browse through the available worlds and start a new campaign from there!</Paragraph>
      )}

      <div className="flex gap-2">
        {campaigns.map((c) => (
          <CampaignCard key={c.campaign.id} campaign={c.campaign} />
        ))}
      </div>
    </div>
  );
}
