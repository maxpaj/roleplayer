import { ButtonLink } from "@/components/ui/button-link";
import { H3, Muted } from "@/components/ui/typography";
import { CharacterCard } from "@/components/character-card";
import { Separator } from "@/components/ui/separator";
import { getWorldData } from "../actions";
import { CreateCharacterForm } from "../../../characters/components/create-character-form";

export default async function NpcPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const worldId = parseInt(id);
  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found!</>;
  }
  const { world, characters } = worldData;

  return (
    <>
      <H3>World characters</H3>
      <Muted>
        These are characters that live in the world, but are not controlled by a
        player
      </Muted>
      <Separator className="my-3" />

      <CreateCharacterForm worldId={worldId} />

      {characters.length === 0 && (
        <Muted className="my-4">It's empty! No characters added yet.</Muted>
      )}

      <div className="flex gap-2 my-2">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            worldId={world.id}
            character={character}
          />
        ))}
      </div>
    </>
  );
}
