import { Character, Clazz } from "@repo/rp-lib/character";
import { RemoveFunctions } from "types/without-functions";

type ClassEditorProps = {
  clazz: Clazz;
  character: RemoveFunctions<Character>;
};

export function CharacterClassEditor({ clazz, character }: ClassEditorProps) {
  const characterClass = character.classes.find((c) => c.classId === clazz.id);

  if (!characterClass) {
    throw new Error("Cannot find character class");
  }

  return (
    <div>
      <div>
        {clazz.name} (Level {characterClass.level})
      </div>
      <div>Select skills</div>
      {clazz.levelProgression.map((lp) => (
        <>{lp.ability.name}</>
      ))}
    </div>
  );
}
