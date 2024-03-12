import { getWorldData } from "./actions";
import { WorldEditorForm } from "./components/world-editor-form";

export default async function WorldPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const data = await getWorldData(parseInt(id));

  if (!data) {
    return <>Not found!</>;
  }

  return (
    <>
      <WorldEditorForm world={data.world} />
    </>
  );
}
