import { Divider } from "@/components/ui/divider";
import { H3, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { AlertOctagon } from "lucide-react";
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
      <H3>History</H3>
      <Divider className="my-3" />

      <div className="my-2 flex items-center gap-2">
        <AlertOctagon size={16} />
        <Muted>Identifiers are truncated down to the last 8 characters of their UUIDs</Muted>
      </div>

      <EventsTable events={campaignData.events} />
    </>
  );
}
