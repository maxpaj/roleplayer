import Link from "next/link";
import { World } from "@repo/rp-lib/world";

type WorldCardProps = { world: World };

export function WorldCard({ world }: WorldCardProps) {
  return (
    <Link href={`/worlds/${world.id}`}>
      <div className="border border-slate-500 p-3 hover-border-slate-100">
        {world.name}
      </div>
    </Link>
  );
}
