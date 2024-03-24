import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Muted, Paragraph } from "@/components/ui/typography";
import { Actor } from "roleplayer";
import { useState } from "react";
import { EMPTY_GUID } from "@/lib/guid";
import { ButtonLink } from "@/components/ui/button-link";
import { WorldRecord } from "@/db/schema/worlds";
import { ActorAggregated } from "services/world-service";

export function AddBattleMonsterButton({
  monsters,
  worldId,
  onAddMonster,
}: {
  monsters: ActorAggregated[];
  worldId: WorldRecord["id"];
  onAddMonster: (monsterId: Actor["id"]) => void;
}) {
  const [selectedMonster, setSelectedMonster] = useState<Actor["id"]>(EMPTY_GUID);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add monster</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add monster</DialogTitle>
        </DialogHeader>

        {monsters.length === 0 && <Muted>No monsters added to the world</Muted>}
        {monsters.length > 0 && (
          <>
            <Paragraph>Select monster type to add</Paragraph>
            <Combobox
              onChange={(monsterId) => setSelectedMonster(monsterId)}
              options={monsters.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              }))}
            />
          </>
        )}

        <DialogFooter>
          {monsters.length === 0 && (
            <ButtonLink variant="outline" href={`/worlds/${worldId}/monsters`}>
              Create new monster
            </ButtonLink>
          )}
          <Button
            disabled={selectedMonster === EMPTY_GUID}
            onClick={() => {
              setOpen(false);
              onAddMonster(selectedMonster);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
