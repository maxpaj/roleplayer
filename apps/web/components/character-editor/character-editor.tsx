"use client";

import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { H4, H5, Muted } from "@/components/ui/typography";
import { useState } from "react";
import { Actor, Campaign, World } from "roleplayer";
import { CharacterInventoryEditor } from "./inventory/character-inventory-editor";
import { CharacterStatsEditor } from "./stats/character-stats-editor";
import { CharacterLevelEditor } from "./classes/character-level-editor";

type CharacterEditorProps = {
  onSave: (character: Actor) => void;
  world: World;
  character: Actor;
  campaign: Campaign;
};

export function CharacterEditor({ campaign, onSave, world, character }: CharacterEditorProps) {
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
          <Button variant="outline" className="h-4 px-3 py-4 text-xs" onClick={() => onSave(update)}>
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
                <H5 className="my-2">Classes</H5>
                <Muted>Choose your character classes</Muted>
                <CharacterLevelEditor
                  campaign={campaign}
                  character={character}
                  onChange={(classes) => {
                    setUpdate((prev) => {
                      prev.classes = [...classes];
                      return prev;
                    });
                  }}
                  world={world}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="p-4" defaultSize={50}>
                <H5 className="my-2">Equipment/inventory</H5>
                <Muted>Stuff your character with swords, axes, armors, potions, and more</Muted>
                <CharacterInventoryEditor
                  character={update}
                  world={world}
                  onInventoryChange={(inventory) => {
                    setUpdate((prev) => {
                      prev.inventory = [...inventory];
                      return prev;
                    });
                  }}
                  onEquipmentChange={(equipment) => {
                    setUpdate((prev) => {
                      prev.equipment = [...equipment];
                      return prev;
                    });
                  }}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="p-4" defaultSize={25}>
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
