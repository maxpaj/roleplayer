import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { H3, Paragraph } from "@/components/ui/typography";
import { getWorld } from "../actions";

export default async function ItemsPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>Items</H3>
      <Separator className="my-3" />

      {world.items.length === 0 && (
        <Paragraph>It's empty! No items added yet.</Paragraph>
      )}

      <ButtonLink variant="outline" href={`/worlds/${world.id}/monsters`}>
        Create item
      </ButtonLink>
    </>
  );
}
