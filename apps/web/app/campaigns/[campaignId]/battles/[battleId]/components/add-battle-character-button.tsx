import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Muted, Paragraph } from "@/components/ui/typography";
import { Character } from "roleplayer";
import { useState } from "react";
import { EMPTY_GUID } from "@/db/index";

export function AddBattleCharacterButton({
  availableCharacters,
  onAddCharacter,
}: {
  onAddCharacter: (characterId: Character["id"]) => void;
  availableCharacters: Character[];
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character["id"]>(EMPTY_GUID);
  const [open, setOpen] = useState<boolean>(false);

  const characterOptions = availableCharacters.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add character</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add character</DialogTitle>
        </DialogHeader>
        <Paragraph>Select character to add to the battle</Paragraph>
        {availableCharacters.length === 0 && <Muted>No characters added to the availableCharacters.</Muted>}

        {availableCharacters.length > 0 && (
          <Combobox placeholder="Select character to add" onChange={(characterId) => setSelectedCharacter(characterId)} options={characterOptions} />
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
