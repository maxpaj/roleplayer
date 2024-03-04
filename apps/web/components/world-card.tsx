import Link from "next/link";
import { World } from "@repo/rp-lib";
import { H3, Muted } from "./ui/typography";
import { Separator } from "./ui/separator";

type WorldCardProps = { world: World };

export function WorldCard({ world }: WorldCardProps) {
  const worldData = world.applyEvents();

  return (
    <Link href={`/worlds/${world.id}`}>
      <div className="border border-slate-500 p-3 hover-border-slate-100">
        <H3>{world.name}</H3>
        <div>
          {worldData.rounds.length > 0 && (
            <>Played for {worldData.rounds.length} rounds</>
          )}
          {worldData.rounds.length === 0 && <Muted>Not started</Muted>}
        </div>
        <div>
          {worldData.characters.length > 0 && (
            <>{worldData.characters.length} characters</>
          )}
          {worldData.characters.length === 0 && (
            <Muted>No character created yet</Muted>
          )}
        </div>
        <Separator className="my-2" />
        <div>Version {world.libVersion}</div>
      </div>
    </Link>
  );
}
