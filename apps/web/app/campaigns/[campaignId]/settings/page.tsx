import { Divider } from "@/components/ui/divider";
import { H3, H4, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { DeleteCampaignButton } from "./components/delete-campaign-button";

export default async function CampaignSettingsPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>World not found!</>;
  }

  const { campaign } = campaignData;

  return (
    <>
      <H3>Settings</H3>
      <Divider className="my-3" />

      <H4>Delete campaign</H4>
      <Muted className="mb-2">Once you delete a campaign, there is no going back. Please be certain.</Muted>

      <DeleteCampaignButton campaignName={campaign.name} campaignId={campaign.id} />
    </>
  );
}
