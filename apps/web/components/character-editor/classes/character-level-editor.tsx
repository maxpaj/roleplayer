import { Divider } from "@/components/ui/divider";
import { CharacterClassEditor } from "./class-editor";
import { ClassSelector } from "./class-selector";
import { Actor, Campaign, World } from "roleplayer";
import { ClazzRecord } from "@/db/schema/classes";

type CharacterLevelEditorProps = {
  character: Actor;
  campaign: Campaign;
  world: World;
  onChange: (classes: { classId: ClazzRecord["id"]; level: number }[]) => void;
};

export function CharacterLevelEditor({ campaign, character, world, onChange }: CharacterLevelEditorProps) {
  const characterLevel = campaign.getCharacterLevel(character);

  return (
    <>
      <div className="my-4">
        <ClassSelector
          placeholder={
            <>
              Select classes ({character.classes.reduce((sum, curr) => sum + curr.level, 0)}/{characterLevel})
            </>
          }
          characterLevel={characterLevel}
          availableClasses={world.classes}
          character={character}
          onChange={(classes) => {
            onChange(classes);
          }}
        />
      </div>

      {character.classes.map((characterClass) => {
        return (
          <div key={characterClass.classId}>
            <CharacterClassEditor classId={characterClass.classId} world={world} character={character} />
            <Divider className="my-3" />
          </div>
        );
      })}
    </>
  );
}
