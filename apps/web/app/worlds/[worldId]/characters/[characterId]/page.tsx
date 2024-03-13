import { Character, DefaultRuleSet, World } from "roleplayer";
import { CharacterEditor } from "../../../../characters/components/character-editor";
import { classToPlain } from "@/lib/class-to-plain";
import { redirect } from "next/navigation";
import { WorldService } from "services/world-service";
import { DEFAULT_USER_ID } from "@/db/index";

export default async function CharacterPage({
  params: { worldId: id, characterId: cid },
}: {
  params: { worldId: string; characterId: string };
}) {
  const worldId = parseInt(id);
  const characterId = parseInt(cid);

  const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, worldId);

  if (!worldData) {
    return <>World not found</>;
  }

  const { world, characters } = worldData;

  const worldRpLib = new World({ ...world, ruleset: DefaultRuleSet });
  const character = characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  const characterRpLib = new Character({
    ...character,
    description: character.description || "",
  });

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <CharacterEditor
      world={classToPlain(worldRpLib)}
      characterFromEvents={classToPlain(characterRpLib)}
      onSave={async (update) => {
        "use server";
        console.log(update);
        throw new Error("Not implemented");
        redirect("../");
      }}
    />
  );
}
