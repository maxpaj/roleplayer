import { World } from "@repo/rp-lib";
import { Character, Clazz } from "@repo/rp-lib";
import { AbilityCard } from "@/components/ability-card";
import { RemoveFunctions } from "types/without-functions";
import { H2, H3 } from "@/components/ui/typography";

type ClassEditorProps = {
  world: RemoveFunctions<World>;
  character: RemoveFunctions<Character>;
  classId: Clazz["id"];
};

export function CharacterClassEditor({
  classId,
  world,
  character,
}: ClassEditorProps) {
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
      <H2>
        {clazz.name} (Level {characterClass.level})
      </H2>

      <H3>Select skills</H3>
      {clazz.levelProgression.map((lp) => {
        const ability = world.actions.find((a) => a.id === lp.abilityId);
        if (!ability) {
          throw new Error("Ability not found");
        }

        return (
          <div key={lp.abilityId}>
            <AbilityCard
              key={lp.abilityId}
              ability={ability}
              levelProgression={lp}
            />
          </div>
        );
      })}
    </div>
  );
}
