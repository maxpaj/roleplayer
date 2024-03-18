import { ButtonLink } from "@/components/ui/button-link";
import { H3 } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { Divider } from "@/components/ui/divider";

export default async function MapsPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldData = await getWorldData(id);
  if (!worldData) {
    return <>World not found</>;
  }

  const { world } = worldData;

  return (
    <>
      <H3>Maps</H3>
      <Divider className="my-3" />

      <ButtonLink variant="outline" href={`/worlds/${world.id}/maps`}>
        Create a new map
      </ButtonLink>
    </>
  );
}
