import Link from "next/link";
import { World } from "@repo/rp-lib";
import { WorldMetadata } from "repository/world-repository";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type WorldCardProps = { world: World; metadata: WorldMetadata };

export function WorldCard({ world, metadata }: WorldCardProps) {
  return (
    <Link href={`/worlds/${world.id}`}>
      <Card className="w-[200px] h-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{world.name}</CardTitle>
          <CardDescription>{metadata.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
