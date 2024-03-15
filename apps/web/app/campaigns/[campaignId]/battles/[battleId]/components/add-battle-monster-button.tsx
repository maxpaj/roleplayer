import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Muted, Paragraph } from "@/components/ui/typography";
import { Campaign, Monster } from "roleplayer";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";

export function AddBattleMonsterButton({ campaign, onAddMonster }: { onAddMonster: (monsterId: Monster["id"]) => void; campaign: RemoveFunctions<Campaign> }) {
  const [selectedMonster, setSelectedMonster] = useState<Monster["id"]>();
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

        <Paragraph>Select monster type to add</Paragraph>

        {campaign.world!.monsters.length === 0 && <Muted>No monsters added to the world.</Muted>}

        {campaign.world!.monsters.length > 0 && (
          <Combobox
            onChange={(monsterId) => setSelectedMonster(monsterId)}
            options={campaign.world!.monsters.map((c) => ({
              label: c.name,
              value: c.id.toString(),
            }))}
          />
        )}

        <DialogFooter>
          <Button
            disabled={!selectedMonster}
            onClick={() => {
              if (!selectedMonster) {
                return;
              }

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
