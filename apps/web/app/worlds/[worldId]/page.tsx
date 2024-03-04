import { deleteWorld, getWorld } from "./actions";
import { DeleteWorldButton } from "./components/delete-world-button";
import { CreateCharacterButton } from "./components/create-character-button";
import { CharacterCard } from "./characters/components/character-card";
import { redirect } from "next/navigation";
import { H1, H2, H3 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { MonsterCard } from "./monsters/components/monster-card";
import { Tabs } from "@/components/ui/tabs";
import { ButtonLink } from "@/components/ui/button-link";

export default async function WorldPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const world = await getWorld(id);
  const worldData = world.applyEvents();

  if (!world) {
    return <>Not found!</>;
  }

  return (
    <div>
      <div className="flex justify-between mb-3">
        <H2>{world.name}</H2>
        <DeleteWorldButton worldId={world.id} />
      </div>

      <Tabs
        tabs={[
          {
            label: "Characters",
            defaultSelected: true,
            content: (
              <>
                <H3>Characters</H3>
                <Separator className="my-3" />

                <div className="flex gap-2 mb-4">
                  {worldData.characters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      worldId={world.id}
                      character={character}
                    />
                  ))}
                </div>

                <ButtonLink href={`/worlds/${world.id}/characters`}>
                  Create character
                </ButtonLink>
              </>
            ),
          },
          {
            label: "Monsters",
            content: (
              <>
                <H3>Monsters</H3>
                <Separator className="my-3" />

                {world.monsters.map((m) => (
                  <MonsterCard monster={m} />
                ))}

                <ButtonLink href={`/worlds/${world.id}/monsters`}>
                  Create monster
                </ButtonLink>
              </>
            ),
          },
          {
            label: "Items",
            content: (
              <>
                <H3>Items</H3>
                <Separator className="my-3" />

                <ButtonLink href={`/worlds/${world.id}/monsters`}>
                  Create item
                </ButtonLink>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
