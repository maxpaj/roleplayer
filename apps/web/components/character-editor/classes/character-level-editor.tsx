import { Divider } from "@/components/ui/divider";
import { CharacterClassEditor } from "./class-editor";
import { ClassSelector } from "./class-selector";
import { Actor, Campaign, CharacterClass, World } from "roleplayer";

type CharacterLevelEditorProps = {
  character: Actor;
  campaign: Campaign;
  world: World;
  onAddClass: (clazz: CharacterClass) => void;
  onRemoveClass: (clazz: CharacterClass) => void;
  onChange: (classes: CharacterClass[]) => void;
};

export function CharacterLevelEditor({
  campaign,
  character,
  world,
  onAddClass,
  onRemoveClass,
  onChange,
}: CharacterLevelEditorProps) {
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
          onAdd={(clazz) => onAddClass(clazz)}
          onRemove={(clazz) => onRemoveClass(clazz)}
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
