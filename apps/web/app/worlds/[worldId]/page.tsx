import { getWorld } from "./actions";

export default async function WorldPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  if (!world) {
    return <>Not found!</>;
  }

  return <div>World</div>;
}
