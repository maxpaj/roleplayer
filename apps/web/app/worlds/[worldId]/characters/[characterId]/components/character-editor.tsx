"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassDropdown from "./class-selector";
import { Character, World } from "@repo/rp-lib";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";

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
    <div className="flex flex-col gap-2">
      Level {characterLevel}
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
      <ClassDropdown
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
        onChange={(values) => {
          setUpdate((prev) => {
            prev.classes = [...values];
            return { ...prev };
          });
        }}
      />
      <Button onClick={() => onSave(update)}>Save</Button>
    </div>
  );
}
