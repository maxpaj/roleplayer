import { Input } from "@/components/ui/input";
import { getWorld } from "./actions";
import { memoryWorldRepository } from "storage/world-repository";
import { redirect } from "next/navigation";
import { H4, Muted } from "@/components/ui/typography";
import { DeleteWorldButton } from "./components/delete-world-button";
import { PublishWorldButton } from "./components/publish-world-button";
import { UnpublishWorldButton } from "./components/unpublish-world-button";
import { Separator } from "@/components/ui/separator";
import { World } from "@repo/rp-lib";
import { Textarea } from "@/components/ui/textarea";

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
      <div className="flex flex-col gap-2">
        <Input type="name" id="name" name="name" placeholder="World name" />
        <Textarea
          id="story"
          name="story"
          placeholder="Describe the world, the story, background, conflicts, factions, etc."
        />
      </div>
    </>
  );
}
