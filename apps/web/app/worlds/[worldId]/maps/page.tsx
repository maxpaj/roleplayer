import { ButtonLink } from "@/components/ui/button-link";
import { H3 } from "@/components/ui/typography";
import { getWorld } from "../actions";
import { Separator } from "@/components/ui/separator";

export default async function MapsPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>Maps</H3>
      <Separator className="my-3" />

      <ButtonLink variant="outline" href={`/worlds/${world.id}/maps`}>
        Create a new map
      </ButtonLink>
    </>
  );
}
