import { H2, Muted } from "@/components/ui/typography";
import { getCampaigns } from "./actions";
import { CampaignCard } from "@/components/campaign-card";

export default async function CampaignPage() {
  const campaigns = await getCampaigns();

  return (
    <div>
      <H2>Campaigns</H2>
      <Muted className="mb-4">
        Create a new campaign from a selection of worlds, or continue the
        adventure from where you left off!
      </Muted>

      <div className="flex gap-2">
        {campaigns.map((c) => (
          <CampaignCard key={c.entity.id} campaign={c.entity} />
        ))}
      </div>
    </div>
  );
}
