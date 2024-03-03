"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassSelector } from "./class-selector";
import { Character, World } from "@repo/rp-lib";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";
import { CharacterClassEditor } from "./class-editor";
import { CharacterStatsEditor } from "./character-stats-editor";
import { CharacterInventoryEditor } from "./character-inventory-editor";

type CharacterEditorProps = {
  onSave: (character: RemoveFunctions<Character>) => void;
  character: RemoveFunctions<Character>;
  world: RemoveFunctions<World>;
};

export function CharacterEditor({
  onSave,
  world,
  character,
}: CharacterEditorProps) {
  const [update, setUpdate] = useState(character);
  const characterLevel = world.levelProgression.findIndex((l) => l > update.xp);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="Name"
          value={update.name}
          onChange={(e) => {
            setUpdate((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />
        Level {characterLevel} ({character.xp} XP)
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
        <h2>Stats</h2>
        <CharacterStatsEditor
          character={update}
          world={world}
          onChange={(stats) => {
            setUpdate((prev) => ({ ...prev, stats }));
          }}
        />
        <hr />
        <h2>Equipment/inventory</h2>
        <CharacterInventoryEditor
          character={update}
          world={world}
          onChange={(inventory) => {
            setUpdate((prev) => ({ ...prev, inventory }));
          }}
        />
        <hr />
        <h2>Classes</h2>
        {update.classes.map((characterClass) => {
          return (
            <div key={characterClass.classId}>
              <CharacterClassEditor
                classId={characterClass.classId}
                world={world}
                character={update}
              />
              <hr />
            </div>
          );
        })}
        <Button onClick={() => onSave(update)}>Save</Button>
      </div>
    </>
  );
}
