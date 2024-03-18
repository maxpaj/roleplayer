"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { H3, H4, Muted, Paragraph } from "@/components/ui/typography";
import { useState } from "react";
import { Character, World } from "roleplayer";
import { RemoveFunctions } from "types/without-functions";
import { CharacterInventoryEditor } from "./character-inventory-editor";
import { CharacterStatsEditor } from "./character-stats-editor";
import { CharacterClassEditor } from "./class-editor";
import { ClassSelector } from "./class-selector";

type CharacterEditorProps = {
  onSave: (character: RemoveFunctions<Character>) => void;
  world: RemoveFunctions<World>;
  characterFromEvents: RemoveFunctions<Character>;
  characterLevel: number;
};

export function CharacterEditor({ onSave, world, characterFromEvents, characterLevel }: CharacterEditorProps) {
  const [update, setUpdate] = useState(characterFromEvents);

  return (
    <>
      <H3>
        <div className="flex items-center gap-2">
          <Input
            type="name"
            id="name"
            className="scroll-m-20 border-none px-0 text-2xl font-semibold tracking-tight focus-visible:ring-0 focus-visible:ring-offset-0"
            name="name"
            placeholder="Name"
            value={update.name}
            onChange={(e) => {
              setUpdate((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
          />
          <Button variant="outline" className="h-4 px-3 py-4 text-xs" onClick={() => onSave(update)}>
            Save
          </Button>
        </div>
      </H3>
      <Separator className="my-3" />

      <Paragraph>
        Level {characterLevel} ({characterFromEvents.xp} XP)
      </Paragraph>

      <H4 className="my-2">Classes</H4>
      {update.classes.length === 0 && <Muted>Choose your character class</Muted>}

      <ClassSelector
        placeholder={
          <>
            Select classes ({update.classes.reduce((sum, curr) => sum + curr.level, 0)}/{characterLevel})
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
            <CharacterClassEditor classId={characterClass.classId} world={world} character={update} />
            <Separator className="my-3" />
          </div>
        );
      })}
      <H4 className="my-2">Stats</H4>
      <Muted>Stats determine the strengths and weaknesses of your character</Muted>
      <CharacterStatsEditor
        character={update}
        world={world}
        onChange={(stats) => {
          setUpdate((prev) => ({ ...prev, stats }));
        }}
      />
      <H4 className="my-2">Equipment/inventory</H4>
      <Muted>Stuff your character with swords, axes, armors, potions, and more</Muted>
      <CharacterInventoryEditor
        character={update}
        world={world}
        onChange={(inventory) => {
          setUpdate((prev) => ({ ...prev, inventory }));
        }}
      />
    </>
  );
}
