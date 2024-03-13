import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { EventRecord } from "@/db/schema/events";
import { CampaignRecord } from "@/db/schema/campaigns";

type EventCardProps = {
  campaignId: CampaignRecord["id"];
  event: EventRecord;
};

export function EventCard({ campaignId, event }: EventCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/events/${event.id}`}>
      <Card>
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{event.type}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
