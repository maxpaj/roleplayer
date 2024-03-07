import { ButtonLink } from "@/components/ui/button-link";
import { H3, Muted } from "@/components/ui/typography";
import { CharacterCard } from "@/components/character-card";
import { Separator } from "@/components/ui/separator";
import { getWorld } from "../actions";

export default async function NpcPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>World characters</H3>
      <Muted>
        These are characters that live in the world, but are not controlled by a
        player
      </Muted>
      <Separator className="my-3" />

      {world.characters.length === 0 && (
        <Muted className="my-4">It's empty! No characters added yet.</Muted>
      )}

      <div className="flex gap-2">
        {world.characters.map((character) => (
          <CharacterCard
            key={character.id}
            worldId={world.id}
            character={character}
          />
        ))}
      </div>

      <ButtonLink
        className="my-2"
        variant="outline"
        href={`/worlds/${world.id}/characters`}
      >
        Create character
      </ButtonLink>
    </>
  );
}
