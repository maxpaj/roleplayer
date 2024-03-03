"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassSelector } from "./class-selector";
import { Character, World } from "@repo/rp-lib";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";
import { CharacterClassEditor } from "./class-editor";

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
          onChange={(values) => {
            setUpdate((prev) => {
              prev.classes = [...values];
              return { ...prev };
            });
          }}
        />
        {update.classes.map((characterClass) => {
          const clazz = world.classes.find(
            (c) => c.id === characterClass.classId
          );

          if (!clazz) {
            throw new Error("Clazz not found");
          }

          return (
            <>
              <CharacterClassEditor clazz={clazz} character={update} />
              <hr />
            </>
          );
        })}
        <Button onClick={() => onSave(update)}>Save</Button>
      </div>
    </>
  );
}
