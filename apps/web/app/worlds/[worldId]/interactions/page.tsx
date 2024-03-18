import { H3, Muted } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { Divider } from "@/components/ui/divider";

export default async function InteractionsPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);

  if (!worldData) {
    return <>World not found!</>;
  }

  return (
    <>
      <H3>Interactions</H3>
      <Muted>
        Interactions are the base of spells, weapon abilities, or any other kind of interaction between characters and
        the world
      </Muted>
      <Divider className="my-3" />
    </>
  );
}
