"use client";

import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { H4, H5, Muted } from "@/components/ui/typography";
import { useState } from "react";
import { Actor, Campaign, CharacterInventoryItem, World } from "roleplayer";
import { CharacterInventoryEditor } from "./inventory/character-inventory-editor";
import { CharacterStatsEditor } from "./stats/character-stats-editor";
import { CharacterLevelEditor } from "./classes/character-level-editor";
import { ScrollArea } from "../ui/scroll-area";

type CharacterEditorProps = {
  onSaveCharacter?: (character: Actor) => void;
  onSaveCampaign?: (campaign: Campaign) => void;

  world: World;
  character: Actor;
  campaign: Campaign;
};

export function CharacterEditor({ campaign, onSaveCharacter, onSaveCampaign, world, character }: CharacterEditorProps) {
  const [update, setUpdate] = useState(character);

  if (!character) {
    throw new Error("Character not found in campaign state");
  }

  return (
    <>
      <H4>
        <div className="flex items-center gap-2">
          <Input
            type="name"
            id="name"
            className="scroll-m-20 border-none px-0 text-xl font-semibold tracking-tight focus-visible:ring-0 focus-visible:ring-offset-0"
            name="name"
            placeholder="Name"
            value={update.name}
            onChange={(e) => {
              setUpdate((prev) => {
                prev.name = e.target.value;
                return prev;
              });
            }}
          />
          <Button
            variant="outline"
            className="h-4 px-3 py-4 text-xs"
            onClick={() => onSaveCampaign && onSaveCampaign(campaign)}
          >
            Save
          </Button>
        </div>
      </H4>

      <Divider className="my-3" />

      <div className="h-[75vh]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel className="p-4" defaultSize={50}>
                <ScrollArea className="h-full w-full">
                  <H5 className="my-2">Classes</H5>
                  <Muted>Choose your character classes</Muted>
                  <CharacterLevelEditor
                    campaign={campaign}
                    character={character}
                    onAddClass={(clazz) => {}}
                    onRemoveClass={(clazz) => {}}
                    onChange={(classes) => {
                      setUpdate((prev) => {
                        prev.classes = [...classes];
                        return prev;
                      });
                    }}
                    world={world}
                  />
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="p-4" defaultSize={50}>
                <ScrollArea className="h-full w-full">
                  <H5 className="my-2">Equipment/inventory</H5>
                  <Muted>Stuff your character with swords, axes, armors, potions, and more</Muted>
                  <CharacterInventoryEditor
                    character={update}
                    world={world}
                    onEquipmentAdd={(slot, addedItem) => {
                      campaign.characterEquipItem(character.id, slot, addedItem!.id);
                    }}
                    onEquipmentRemove={(slot, removedItem) => {
                      campaign.characterUnEquipItem(character.id, slot, removedItem?.id);
                    }}
                    onInventoryAdd={(inventory: CharacterInventoryItem) => {
                      campaign.addCharacterItem(character.id, inventory.id);
                    }}
                    onInventoryRemove={(inventory: CharacterInventoryItem) => {
                      campaign.removeCharacterItem(character.id, inventory.id);
                    }}
                  />
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="p-4" defaultSize={25}>
            <ScrollArea className="h-full w-full">
              <H5 className="my-2">Stats</H5>
              <Muted>Stats determine the strengths and weaknesses of your character</Muted>
              <CharacterStatsEditor
                character={update}
                world={world}
                onChange={(stats) => {
                  setUpdate((prev) => {
                    prev.stats = [...stats];
                    return prev;
                  });
                }}
              />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
