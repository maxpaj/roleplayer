import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Muted, Paragraph } from "@/components/ui/typography";
import { Character } from "roleplayer";
import { useState } from "react";
import { EMPTY_GUID } from "@/lib/guid";
import { ButtonLink } from "@/components/ui/button-link";
import { CampaignRecord } from "@/db/schema/campaigns";

export function AddBattleCharacterButton({
  availableCharacters,
  campaignId,
  onAddCharacter,
}: {
  onAddCharacter: (characterId: Character["id"]) => void;
  availableCharacters: Character[];
  campaignId: CampaignRecord["id"];
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
        {availableCharacters.length === 0 && <Muted>No characters added to the campaign yet</Muted>}
        {availableCharacters.length > 0 && (
          <>
            <Paragraph>Select character to add to the battle</Paragraph>
            <Combobox placeholder="Select character to add" onChange={(characterId) => setSelectedCharacter(characterId)} options={characterOptions} />
          </>
        )}

        <DialogFooter>
          {availableCharacters.length === 0 && (
            <ButtonLink variant="outline" href={`/campaigns/${campaignId}/characters`}>
              Add character
            </ButtonLink>
          )}
          <Button
            disabled={selectedCharacter === EMPTY_GUID}
            onClick={() => {
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
