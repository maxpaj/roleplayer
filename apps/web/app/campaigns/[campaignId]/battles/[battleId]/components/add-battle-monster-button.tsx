import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/typography";
import { Campaign, Monster } from "@repo/rp-lib";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";

export function AddBattleMonsterButton({
  campaign,
  onAddMonster,
}: {
  onAddMonster: (monsterId: Monster["id"]) => void;
  campaign: RemoveFunctions<Campaign>;
}) {
  const [selectedMonster, setSelectedMonster] = useState<Monster["id"]>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add monster</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add monster</DialogTitle>
        </DialogHeader>
        <Paragraph>Select monster type to add</Paragraph>
        <Combobox
          onChange={(monsterId) => setSelectedMonster(monsterId)}
          options={campaign.adventurers.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              if (!selectedMonster) {
                return;
              }

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
