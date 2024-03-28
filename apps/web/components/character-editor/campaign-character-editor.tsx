"use client";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { H4, H5, Muted } from "@/components/ui/typography";
import { Actor, Campaign, CharacterInventoryItem, ItemDefinition, World } from "roleplayer";
import { CharacterInventoryEditor } from "./inventory/character-inventory-editor";
import { CharacterStatsEditor } from "./stats/character-stats-editor";
import { CharacterLevelEditor } from "./classes/character-level-editor";
import { ScrollArea } from "../ui/scroll-area";

type CharacterEditorProps = {
  onSaveCharacter?: (character: Actor) => void;
  onSaveCampaign: (campaign: Campaign) => void;

  world: World;
  character: Actor;
  campaign: Campaign;
};

export function CampaignCharacterEditor({
  campaign,
  onSaveCharacter,
  onSaveCampaign,
  world,
  character,
}: CharacterEditorProps) {
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
            value={character.name}
            onChange={(e) => {
              throw new Error("Not implemented");
            }}
          />
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
                    onAddClass={(clazz) => {
                      throw new Error("Not implemented");
                    }}
                    onRemoveClass={(clazz) => {
                      throw new Error("Not implemented");
                    }}
                    onChange={(classes) => {
                      throw new Error("Not implemented");
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
                    character={character}
                    world={world}
                    onEquipmentAdd={(slot, addedItem) => {
                      campaign.characterEquipItem(character.id, slot, addedItem!.id);
                      onSaveCampaign(campaign);
                    }}
                    onEquipmentRemove={(slot, removedItem) => {
                      campaign.characterUnEquipItem(character.id, slot, removedItem?.id);
                      onSaveCampaign(campaign);
                    }}
                    onInventoryAdd={(item: ItemDefinition) => {
                      campaign.addCharacterItem(character.id, item.id);
                      onSaveCampaign(campaign);
                    }}
                    onInventoryRemove={(inventory: CharacterInventoryItem) => {
                      campaign.removeCharacterItem(character.id, inventory.id);
                      onSaveCampaign(campaign);
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
                character={character}
                world={world}
                onChange={(stats) => {
                  throw new Error("Not implemented");
                }}
              />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
