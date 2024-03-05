import { ButtonLink } from "@/components/ui/button-link";
import { H3, Muted, Paragraph } from "@/components/ui/typography";
import { CharacterCard } from "../characters/components/character-card";
import { Separator } from "@/components/ui/separator";
import { getWorld } from "../actions";

export default async function NpcPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);
  const worldData = world.applyEvents();

  return (
    <>
      <H3>World characters</H3>
      <Muted>
        These are characters that live in the world, but are not controlled by a
        player
      </Muted>
      <Separator className="my-3" />

      {worldData.characters.length === 0 && (
        <Paragraph className="my-4">
          It's empty! No characters added yet.
        </Paragraph>
      )}

      {worldData.characters.length > 0 && (
        <div className="flex gap-2 mb-4">
          {worldData.characters.map((character) => (
            <CharacterCard
              key={character.id}
              worldId={world.id}
              character={character}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <ButtonLink variant="outline" href={`/worlds/${world.id}/characters`}>
          Create character
        </ButtonLink>
      </div>
    </>
  );
}
