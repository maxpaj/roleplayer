import { memoryWorldRepository } from "../../../../../storage/world-repository";
import { Character } from "@repo/rp-lib";
import { CharacterEditor } from "./components/character-editor";
import { classToPlain } from "@/lib/class-to-plain";
import { redirect } from "next/navigation";

async function getWorld(worldId: string) {
  const world = await memoryWorldRepository.getWorld(worldId);
  return world;
}

export default async function CharacterPage({
  params,
}: {
  params: { worldId: string; characterId: string };
}) {
  async function updateCharacter(
    worldId: string,
    characterId: string,
    characterUpdate: Partial<Character>
  ) {
    "use server";
    const world = await memoryWorldRepository.getWorld(worldId);
    world.setCharacterClasses(characterId, characterUpdate.classes!);
    await memoryWorldRepository.saveWorld(world);
  }

  const { characterId, worldId } = params;
  const world = await getWorld(worldId);
  if (!world) {
    throw new Error("Could not find world");
  }

  const data = world.applyEvents();
  const character = data.characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <hr className="my-2" />

      <CharacterEditor
        world={classToPlain(world)}
        character={classToPlain(character)}
        onSave={async (update) => {
          "use server";
          await updateCharacter(worldId, characterId, update);
          redirect("../");
        }}
      />
    </div>
  );
}
