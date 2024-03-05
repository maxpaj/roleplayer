import { Separator } from "@/components/ui/separator";
import { H3, Muted, Paragraph } from "@/components/ui/typography";
import { getWorld } from "../actions";

export default async function CampaignsPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>Campaigns</H3>
      <Muted>List of campaigns started from this world</Muted>
      <Separator className="my-3" />
      <Paragraph>No campaigns started yet.</Paragraph>
    </>
  );
}
