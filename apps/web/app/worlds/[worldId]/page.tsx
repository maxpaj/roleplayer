import { getWorld } from "./actions";
import { redirect } from "next/navigation";
import { World } from "@repo/rp-lib";
import { WorldEditorForm } from "./components/world-editor-form";
import { classToPlain } from "@/lib/class-to-plain";
import { jsonWorldRepository } from "storage/json/json-world-repository";

async function updateWorld(formData: FormData) {
  "use server";
  throw new Error("fix this");
  const worldId: World["id"] = "TODO"; // TODO: This.
  const { metadata, entity: world } =
    await jsonWorldRepository.getWorld(worldId);
  world.name = formData.get("name") as string;
  metadata.description = formData.get("description") as string;
  await jsonWorldRepository.saveWorld(world);
  return redirect(`/worlds/${worldId}`);
}

export default async function WorldPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world, metadata } = await getWorld(id);

  if (!world) {
    return <>Not found!</>;
  }

  return (
    <>
      <WorldEditorForm metadata={metadata} world={classToPlain(world)} />
    </>
  );
}
