import { HelpCircle } from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CampaignEventWithRound, isCharacterEvent } from "roleplayer";

export function CharacterEventsTable({ events }: { events: CampaignEventWithRound[] }) {
  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Character</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Battle</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events
            .toSorted((a, b) => a.serialNumber - b.serialNumber)
            .map((e) => {
              const characterEvent = isCharacterEvent(e) ? e : null;

              if (!characterEvent) {
                return <></>;
              }

              return (
                <TableRow key={characterEvent.id}>
                  <TableCell>{characterEvent.id.slice(-8)}</TableCell>
                  <TableCell>{characterEvent.type}</TableCell>
                  <TableCell>{(characterEvent.characterId || "").slice(-8)}</TableCell>
                  <TableCell>{(characterEvent.roundId || "").slice(-8)}</TableCell>
                  <TableCell>{(characterEvent.battleId || "").slice(-8)}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle />
                        </TooltipTrigger>
                        <TooltipContent>
                          <pre>{JSON.stringify(e, null, 2)}</pre>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
