import { getWorld } from "./actions";
import { DeleteWorldButton } from "./components/delete-world-button";
import { CharacterCard } from "./characters/components/character-card";
import { H2, H3, Muted, Paragraph } from "@/components/ui/typography";
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-x-4 flex-wrap">
          <div>
            <H2>{world.name}</H2>
          </div>
          <div className="flex gap-2">
            <ButtonLink href={`/worlds/${world.id}/campaigns`}>
              Start a new campaign
            </ButtonLink>
            <DeleteWorldButton worldId={world.id} />
          </div>
        </div>

        <Muted className={"mb-4"}>{world.description}</Muted>
      </div>

      <Tabs
        tabs={[
          {
            defaultSelected: true,
            label: "Monsters",
            content: (
              <>
                <H3>Monsters</H3>
                <Separator className="my-3" />

                {world.monsters.map((m) => (
                  <MonsterCard monster={m} />
                ))}

                <ButtonLink
                  variant="outline"
                  href={`/worlds/${world.id}/monsters`}
                >
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
                <Paragraph>It's empty! No items added yet.</Paragraph>

                <ButtonLink
                  variant="outline"
                  href={`/worlds/${world.id}/monsters`}
                >
                  Create item
                </ButtonLink>
              </>
            ),
          },
          {
            label: "NPCs",
            content: (
              <>
                <H3>World characters</H3>
                <Muted>
                  These are characters that live in the world, but not
                  controlled by a player.
                </Muted>
                <Separator className="my-3" />

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
                  <ButtonLink
                    variant="outline"
                    href={`/worlds/${world.id}/characters`}
                  >
                    Create character
                  </ButtonLink>
                  <ButtonLink
                    variant="outline"
                    href={`/worlds/${world.id}/invite`}
                  >
                    Invite a friend
                  </ButtonLink>
                </div>
              </>
            ),
          },
          {
            label: "Campaigns",
            content: (
              <>
                <H3>Campaigns</H3>
                <Muted>List of campaigns started from this world.</Muted>
                <Separator className="my-3" />
                <Paragraph>No campaigns started yet.</Paragraph>
              </>
            ),
          },
          {
            label: "Maps",
            content: (
              <>
                <H3>Maps</H3>
                <Separator className="my-3" />

                <ButtonLink variant="outline" href={`/worlds/${world.id}/maps`}>
                  Create a new map
                </ButtonLink>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
