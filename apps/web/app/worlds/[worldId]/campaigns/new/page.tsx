import { Muted } from "@/components/ui/typography";
import { StartCampaignForm } from "./components/start-campaign-form";
import { getWorld } from "../../actions";

export default async function NewCampaignPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <Muted className="my-3">
        A new campaign marks the beginning of an adventure. But without
        adventurers, there is no adventure.
      </Muted>

      <StartCampaignForm worldId={id} />
    </>
  );
}
