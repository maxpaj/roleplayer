import { getWorldData } from "./actions";
import { H2 } from "@/components/ui/typography";
import { BadgeLink, ButtonLink } from "@/components/ui/button-link";
import { GitForkIcon } from "lucide-react";
import Image from "next/image";
import { Divider } from "@/components/ui/divider";

export default async function WorldLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { worldId: string };
}) {
  const { worldId: id } = params;

  const data = await getWorldData(id);

  if (!data) {
    return <>Not found!</>;
  }

  const world = data.world;

  return (
    <div>
      {world.imageUrl && (
        <div className="fixed left-0 top-0 -z-10 h-[800px] w-full opacity-15">
          <div
            className="relative z-10 h-full w-full"
            style={{
              backgroundImage: `linear-gradient(transparent 75%, hsl(var(--background)) 100%)`,
            }}
          />

          <Image
            className="relative z-0"
            src={world.imageUrl}
            fill={true}
            style={{ objectFit: "cover" }}
            alt={"World background"}
          />
        </div>
      )}
      <div className="mb-4 flex flex-wrap justify-between gap-x-4">
        <H2>{world.name}</H2>

        <div className="flex gap-x-2">
          <ButtonLink variant="outline" href={`/worlds/${world.id}/fork`}>
            <GitForkIcon size={16} className="mr-2" /> Copy world
          </ButtonLink>

          <ButtonLink href={`/worlds/${world.id}/campaigns/new`}>Start a new campaign</ButtonLink>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap justify-between gap-1">
        <div className="flex flex-wrap gap-2">
          <BadgeLink href={`/worlds/${world.id}`}>Overview</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/monsters`}>Monsters</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/items`}>Items</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/npcs`}>NPCs</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/classes`}>Classes</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/actions`}>Actions</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/campaigns`}>Campaigns</BadgeLink>
        </div>
        <BadgeLink href={`/worlds/${world.id}/settings`}>Settings</BadgeLink>
      </div>

      {children}
    </div>
  );
}
