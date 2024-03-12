import { Separator } from "@/components/ui/separator";
import { H3, H5 } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { DeleteCampaignButton } from "./components/delete-campaign-button";

export default async function CampaignSettingsPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignId = parseInt(id);
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>World not found!</>;
  }

  const { campaign } = campaignData;

  return (
    <>
      <H3>Settings</H3>
      <Separator className="my-3" />

      <H5 className="my-2">Delete campaign</H5>
      <DeleteCampaignButton
        campaignName={campaign.name}
        campaignId={campaign.id}
      />
    </>
  );
}
