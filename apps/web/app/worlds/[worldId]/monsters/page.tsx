import { Separator } from "@/components/ui/separator";
import { H3, Paragraph } from "@/components/ui/typography";
import { MonsterCard } from "./components/monster-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getWorld } from "../actions";

export default async function MonstersPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>Monsters</H3>
      <Separator className="my-3" />

      {world.monsters.length === 0 && (
        <Paragraph className="my-4">
          It's empty! No monsters added yet.
        </Paragraph>
      )}

      {world.monsters.map((m) => (
        <MonsterCard monster={m} />
      ))}

      <ButtonLink variant="outline" href={`/worlds/${world.id}/monsters`}>
        Create monster
      </ButtonLink>
    </>
  );
}
