import { World } from "@repo/rp-lib";
import { Character, Clazz } from "@repo/rp-lib/character";
import { AbilityCard } from "@/components/ability-card";
import { RemoveFunctions } from "types/without-functions";

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
      <h2>
        {clazz.name} (Level {characterClass.level})
      </h2>

      <h3>Select skills</h3>
      {clazz.levelProgression.map((lp) => {
        const ability = world.actions.find((a) => a.id === lp.abilityId);
        if (!ability) {
          throw new Error("Ability not found");
        }

        return (
          <div key={lp.abilityId}>
            <span>Unlocks at level {lp.unlockedAtLevel}</span>
            <AbilityCard key={lp.abilityId} ability={ability} />
          </div>
        );
      })}
    </div>
  );
}
