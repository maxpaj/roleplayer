import { H2, H3, H4, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";

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
    <>
      <H3>Campaign</H3>
      <Separator className="my-3" />
      <Paragraph>{campaign.metadata.description}</Paragraph>

      <H4>World</H4>
      <Paragraph>{campaign.entity.world?.name}</Paragraph>
    </>
  );
}
