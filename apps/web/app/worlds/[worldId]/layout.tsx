import { getWorldData } from "./actions";
import { H2 } from "@/components/ui/typography";
import { BadgeLink, ButtonLink } from "@/components/ui/button-link";
import { GitForkIcon } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

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
        <div className="fixed w-full h-[800px] -z-10 opacity-15 top-0 left-0">
          <div
            className="relative w-full h-full z-10"
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
      <div className="flex justify-between gap-x-4 flex-wrap mb-4">
        <H2>{world.name}</H2>

        <div className="flex gap-x-2">
          <ButtonLink variant="outline" href={`/worlds/${world.id}/fork`}>
            <GitForkIcon size={16} className="mr-2" /> Copy world
          </ButtonLink>

          <ButtonLink href={`/worlds/${world.id}/campaigns/new`}>
            Start a new campaign
          </ButtonLink>
        </div>
      </div>

      <div className="flex mb-8 justify-between flex-wrap gap-1">
        <div className="flex gap-2 flex-wrap">
          <BadgeLink href={`/worlds/${world.id}`}>Overview</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/monsters`}>Monsters</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/items`}>Items</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/npcs`}>NPCs</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/classes`}>Classes</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/campaigns`}>
            Campaigns
          </BadgeLink>
        </div>
        <BadgeLink href={`/worlds/${world.id}/settings`}>Settings</BadgeLink>
      </div>

      {children}
    </div>
  );
}
