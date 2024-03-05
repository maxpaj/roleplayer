import { Input } from "@/components/ui/input";
import { getWorld } from "./actions";
import { memoryWorldRepository } from "storage/world-repository";
import { redirect } from "next/navigation";
import { World } from "@repo/rp-lib";
import { Textarea } from "@/components/ui/textarea";
import { Muted } from "@/components/ui/typography";
import Link from "next/link";
import { Info } from "lucide-react";
import { WorldEditorForm } from "./components/world-editor-form";
import { classToPlain } from "@/lib/class-to-plain";

async function updateWorld(formData: FormData) {
  "use server";
  throw new Error("fix this");
  const worldId: World["id"] = "TODO"; // TODO: This.
  const { entity: world } = await memoryWorldRepository.getWorld(worldId);
  world.name = formData.get("name") as string;
  world.description = formData.get("description") as string;
  await memoryWorldRepository.saveWorld(world);
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
      <WorldEditorForm world={classToPlain(world)} />
    </>
  );
}
