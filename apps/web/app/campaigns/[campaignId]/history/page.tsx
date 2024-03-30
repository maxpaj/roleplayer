import { getCampaign } from "app/campaigns/actions";
import { EventsTable } from "@/components/events-table";

export default async function CampaignEventsPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  return (
    <>
      <EventsTable events={campaignData.events} />
    </>
  );
}
