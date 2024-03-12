import { H2, H3, H4, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";
import { Separator } from "@/components/ui/separator";

export default async function CampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignData = await getCampaign(parseInt(id));

  if (!campaignData) {
    return <>Not found!</>;
  }

  const { campaign } = campaignData;

  return (
    <>
      <H3>Campaign</H3>
      <Separator className="my-3" />
      <Paragraph>{campaign.description}</Paragraph>

      <H4>World</H4>
      <Paragraph>{campaign.name}</Paragraph>
    </>
  );
}
