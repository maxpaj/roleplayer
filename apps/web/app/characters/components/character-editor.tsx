"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassSelector } from "./class-selector";
import { Character, World } from "roleplayer";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";
import { CharacterClassEditor } from "./class-editor";
import { CharacterStatsEditor } from "./character-stats-editor";
import { CharacterInventoryEditor } from "./character-inventory-editor";
import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";

type CharacterEditorProps = {
  onSave: (character: RemoveFunctions<Character>) => void;
  characterFromEvents: RemoveFunctions<Character>;
  world: RemoveFunctions<World>;
};

export function CharacterEditor({
  onSave,
  world,
  characterFromEvents,
}: CharacterEditorProps) {
  const [update, setUpdate] = useState(characterFromEvents);
  const characterLevel = world.ruleset.levelProgression.findIndex(
    (l) => l > update.xp
  );

  return (
    <>
      <H3>
        <div className="flex items-center gap-2">
          <Input
            type="name"
            id="name"
            className="scroll-m-20 focus-visible:ring-offset-0 focus-visible:ring-0 text-2xl font-semibold tracking-tight border-none px-0"
            name="name"
            placeholder="Name"
            value={update.name}
            onChange={(e) => {
              setUpdate((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
          />
          <Button
            variant="outline"
            className="text-xs px-3 py-4 h-4"
            onClick={() => onSave(update)}
          >
            Save
          </Button>
        </div>
      </H3>
      <Separator className="my-3" />

      <div className="flex flex-col gap-2">
        Level {characterLevel} ({characterFromEvents.xp} XP)
        <H3>Classes</H3>
        {update.classes.length === 0 && (
          <Muted>Choose your character class</Muted>
        )}
        <ClassSelector
          placeholder={
            <>
              Select classes (
              {update.classes.reduce((sum, curr) => sum + curr.level, 0)}/
              {characterLevel})
            </>
          }
          characterLevel={characterLevel}
          availableClasses={world.classes}
          character={update}
          onChange={(classes) => {
            setUpdate((prev) => ({ ...prev, classes }));
          }}
        />
        {update.classes.map((characterClass) => {
          return (
            <div key={characterClass.classId}>
              <CharacterClassEditor
                classId={characterClass.classId}
                world={world}
                character={update}
              />
              <Separator className="my-3" />
            </div>
          );
        })}
        <H3>Stats</H3>
        <Muted>
          Stats determine the strengths and weaknesses of your character
        </Muted>
        <CharacterStatsEditor
          character={update}
          world={world}
          onChange={(stats) => {
            setUpdate((prev) => ({ ...prev, stats }));
          }}
        />
        <H3>Equipment/inventory</H3>
        <Muted>
          Stuff your character with swords, axes, armors, potions, and more
        </Muted>
        <CharacterInventoryEditor
          character={update}
          world={world}
          onChange={(inventory) => {
            setUpdate((prev) => ({ ...prev, inventory }));
          }}
        />
      </div>
    </>
  );
}
