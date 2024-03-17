import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Muted, Paragraph } from "@/components/ui/typography";
import { Campaign, Monster } from "roleplayer";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";
import { EMPTY_GUID } from "@/lib/guid";
import { ButtonLink } from "@/components/ui/button-link";

export function AddBattleMonsterButton({ campaign, onAddMonster }: { onAddMonster: (monsterId: Monster["id"]) => void; campaign: RemoveFunctions<Campaign> }) {
  const [selectedMonster, setSelectedMonster] = useState<Monster["id"]>(EMPTY_GUID);
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

        {campaign.world!.monsters.length === 0 && <Muted>No monsters added to the world</Muted>}
        {campaign.world!.monsters.length > 0 && (
          <>
            <Paragraph>Select monster type to add</Paragraph>
            <Combobox
              onChange={(monsterId) => setSelectedMonster(monsterId)}
              options={campaign.world!.monsters.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              }))}
            />
          </>
        )}

        <DialogFooter>
          {campaign.world!.monsters.length === 0 && (
            <ButtonLink variant="outline" href={`/worlds/${campaign.world.id}/monsters`}>
              Add monster
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
