import { EventCard } from "@/components/event-card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H3 } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";

export default async function CampaignEventsPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignId = parseInt(id);
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  return (
    <>
      <H3>Events</H3>
      <Separator className="my-3" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Character</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Battle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignData.events
            .sort((a, b) => a.id - b.id)
            .map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.type}</TableCell>
                <TableCell>{e.characterId}</TableCell>
                <TableCell>{e.roundId}</TableCell>
                <TableCell>{e.battleId}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
