import { CreateCharacterForm } from "./components/create-character-form";
import { CharacterCard } from "./components/character-card";
import { memoryWorldRepository } from "../../../../storage/world-repository";

async function getData(worldId: string) {
  const world = await memoryWorldRepository.getWorld(worldId);
  const data = world.applyEvents();
  return data.characters;
}

export default async function CharactersPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId } = params;
  const characters = await getData(worldId);

  return (
    <div>
      <h1>Create a new character</h1>
      <hr className="my-2" />

      <CreateCharacterForm worldId={params.worldId} />
      <hr className="my-2" />

      <div className="flex gap-2">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            worldId={worldId}
          />
        ))}
      </div>
    </div>
  );
}
