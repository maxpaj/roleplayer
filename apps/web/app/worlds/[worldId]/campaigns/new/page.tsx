import { Muted } from "@/components/ui/typography";
import { StartCampaignForm } from "./components/start-campaign-form";
import { getWorldData } from "../../actions";

export default async function NewCampaignPage({
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

  return (
    <>
      <Muted className="my-3">
        A new campaign marks the beginning of an adventure, who knows where the
        world might take you.
      </Muted>

      <StartCampaignForm worldId={worldId} />
    </>
  );
}
