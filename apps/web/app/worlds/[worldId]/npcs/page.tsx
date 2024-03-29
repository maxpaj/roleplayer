import { H3, Muted } from "@/components/ui/typography";
import { Divider } from "@/components/ui/divider";
import { getWorldData } from "../actions";
import { CreateCharacterForm } from "../../../characters/components/create-character-form";
import { CharacterCard } from "@/components/character-card";

export default async function NpcPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const world = await getWorldData(worldId);
  if (!world) {
    return <>World not found!</>;
  }
  const { characters } = world;

  return (
    <>
      <H3>Non-player characters</H3>
      <Muted>These are characters that live in the world, but are not controlled by a player</Muted>
      <Divider className="my-3" />

      <CreateCharacterForm worldId={worldId} />

      {characters.length === 0 && <Muted className="my-4">It's empty! No characters added yet.</Muted>}

      <div className="my-2 flex gap-2">
        {characters
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((character) => (
            <CharacterCard key={character.id} worldId={world.id} character={character} />
          ))}
      </div>
    </>
  );
}
