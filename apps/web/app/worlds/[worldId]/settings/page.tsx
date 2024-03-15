import { H3, H5, Muted } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { DeleteWorldButton } from "../components/delete-world-button";
import { PublishWorldButton } from "../components/publish-world-button";
import { UnpublishWorldButton } from "../components/unpublish-world-button";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found!</>;
  }

  const { world } = worldData;

  return (
    <>
      <H3>Settings</H3>
      <Separator className="my-3" />

      <H5>Publish world</H5>
      <Muted className="my-2">Sharing your world with others will allow others to play campaigns in your world</Muted>

      {!world.isTemplate && <PublishWorldButton worldName={world.name} worldId={world.id} />}
      {world.isTemplate && <UnpublishWorldButton worldName={world.name} worldId={world.id} />}

      <H5 className="my-2">Delete world</H5>
      <DeleteWorldButton worldName={world.name} worldId={world.id} />
    </>
  );
}
