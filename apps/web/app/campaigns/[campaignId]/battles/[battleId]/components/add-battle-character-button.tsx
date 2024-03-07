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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add character</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add character</DialogTitle>
        </DialogHeader>
        <Paragraph>Select character to add</Paragraph>
        <Combobox
          onChange={(characterId) => setSelectedCharacter(characterId)}
          options={campaign.adventurers.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              if (!selectedCharacter) {
                return;
              }

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
