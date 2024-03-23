import { HelpCircle } from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { EventRecord } from "@/db/schema/events";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function EventsTable({ events }: { events: EventRecord[] }) {
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
            .sort((a, b) => a.serialNumber - b.serialNumber)
            .map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.id.slice(-8)}</TableCell>
                <TableCell>{e.type}</TableCell>
                <TableCell>{(e.characterId || "").slice(-8)}</TableCell>
                <TableCell>{(e.roundId || "").slice(-8)}</TableCell>
                <TableCell>{(e.battleId || "").slice(-8)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle />
                      </TooltipTrigger>
                      <TooltipContent>
                        <pre>{JSON.stringify(e.eventData, null, 2)}</pre>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
