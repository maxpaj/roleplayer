import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { H3, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info } from "lucide-react";

export default async function CampaignEventsPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  return (
    <>
      <H3>Events</H3>
      <Separator className="my-3" />

      <div className="flex items-center gap-2 my-2">
        <Info size={16} />
        <Muted>
          Identifiers are truncated down to the last 8 characters of their UUIDs
        </Muted>
      </div>

      <ScrollArea>  
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
              .sort((a, b) => a.id < b.id ? -1 : 1)
              .map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id.slice(-8)}</TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell>{(e.characterId || "").slice(-8)}</TableCell>
                  <TableCell>{(e.roundId || "").slice(-8)}</TableCell>
                  <TableCell>{(e.battleId || "").slice(-8)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
