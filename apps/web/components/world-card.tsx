import Link from "next/link";
import { World } from "@repo/rp-lib";
import { H3, Muted } from "./ui/typography";

type WorldCardProps = { world: World };

export function WorldCard({ world }: WorldCardProps) {
  const worldData = world.applyEvents();

  return (
    <Link href={`/worlds/${world.id}`}>
      <div className="border border-slate-500 p-3 hover-border-slate-100">
        <H3>{world.name}</H3>
        <Muted>
          {worldData.rounds.length > 0 && (
            <>Played for {worldData.rounds.length} rounds</>
          )}
          {worldData.rounds.length === 0 && <>Not started</>}
        </Muted>
        <Muted>
          {worldData.characters.length > 0 && (
            <>{worldData.characters.length} characters</>
          )}
          {worldData.characters.length === 0 && <>No character created yet</>}
        </Muted>
      </div>
    </Link>
  );
}
