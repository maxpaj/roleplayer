import { getWorldData } from "./actions";
import { WorldEditorForm } from "./components/world-editor-form";

export default async function WorldPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const world = await getWorldData(id);

  if (!world) {
    return <>Not found!</>;
  }

  return (
    <>
      <WorldEditorForm world={world} />
    </>
  );
}
