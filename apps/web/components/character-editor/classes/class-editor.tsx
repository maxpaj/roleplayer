import { World } from "roleplayer";
import { Actor, Clazz } from "roleplayer";
import { LevelAbilityCard } from "@/components/level-ability-card";
import { RemoveFunctions } from "types/without-functions";
import { H5, Muted } from "@/components/ui/typography";

type ClassEditorProps = {
  world: RemoveFunctions<World>;
  character: RemoveFunctions<Actor>;
  classId: Clazz["id"];
};

export function CharacterClassEditor({ classId, world, character }: ClassEditorProps) {
  const clazz = world.classes.find((c) => c.id === classId);

  if (!clazz) {
    throw new Error("Clazz not found");
  }

  const characterClass = character.classes.find((c) => c.classId === classId);

  if (!characterClass) {
    throw new Error("Cannot find character class");
  }

  return (
    <div>
      <H5>
        {clazz.name} (Level {characterClass.level})
      </H5>

      <Muted>Select {clazz.name} skills</Muted>

      {(clazz.levelProgression || []).map((lp) => {
        const ability = world.actions.find((a) => a.id === lp.actionDefinitionId);
        if (!ability) {
          throw new Error("Ability not found");
        }

        return (
          <div key={lp.actionDefinitionId}>
            <LevelAbilityCard key={lp.actionDefinitionId} worldId={world.id} ability={ability} levelProgression={lp} />
          </div>
        );
      })}
    </div>
  );
}
