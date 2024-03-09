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
import { Muted, Paragraph } from "@/components/ui/typography";
import { Campaign, Character } from "@repo/rp-lib";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";

export function AddBattleCharacterButton({
  campaign,
  onAddCharacter,
}: {
  onAddCharacter: (characterId: Character["id"]) => void;
  campaign: RemoveFunctions<Campaign>;
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character["id"]>();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add character</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add character</DialogTitle>
        </DialogHeader>
        <Paragraph>Select character to add</Paragraph>

        {campaign.adventurers.length === 0 && (
          <Muted>No adventurers added to the campaign.</Muted>
        )}

        {campaign.adventurers.length > 0 && (
          <Combobox
            onChange={(characterId) => setSelectedCharacter(characterId)}
            options={campaign.adventurers.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        )}

        <DialogFooter>
          <Button
            disabled={!selectedCharacter}
            onClick={() => {
              if (!selectedCharacter) {
                return;
              }

              setOpen(false);
              onAddCharacter(selectedCharacter);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
