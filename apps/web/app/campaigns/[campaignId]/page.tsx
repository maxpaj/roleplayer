import { H2, Muted, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";

export default async function CampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const campaign = await getCampaign(params.campaignId);
  if (!campaign) {
    return <H2>Not found!</H2>;
  }

  return (
    <div>
      <H2>{campaign.entity.name}</H2>
      <Muted className="mb-4">Let's play the campaign!</Muted>
      <Paragraph>{campaign.metadata.description}</Paragraph>
    </div>
  );
}
