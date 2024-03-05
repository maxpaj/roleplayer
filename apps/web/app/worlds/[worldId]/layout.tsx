import { getWorld } from "./actions";
import { H2, Muted } from "@/components/ui/typography";
import { BadgeLink, ButtonLink } from "@/components/ui/button-link";

export default async function WorldLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  if (!world) {
    return <>Not found!</>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-x-4 flex-wrap">
          <H2>{world.name}</H2>

          <ButtonLink href={`/worlds/${world.id}/campaigns/new`}>
            Start a new campaign
          </ButtonLink>
        </div>

        <Muted className={"mb-4"}>{world.description}</Muted>
      </div>

      <div className="flex mb-4 justify-between flex-wrap">
        <div className="flex gap-1">
          <BadgeLink href={`/worlds/${world.id}`}>World</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/monsters`}>Monsters</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/items`}>Items</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/npcs`}>NPCs</BadgeLink>
          <BadgeLink href={`/worlds/${world.id}/maps`}>Maps</BadgeLink>
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
