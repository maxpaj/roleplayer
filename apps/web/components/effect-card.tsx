import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { WorldRecord } from "@/db/schema/worlds";
import { EffectRecord } from "@/db/schema/effects";

type EffectCardProps = {
  effect: EffectRecord;
  worldId: WorldRecord["id"];
};

export function EffectCard({ worldId, effect }: EffectCardProps) {
  return (
    <Link href={`/worlds/${worldId}/effects/${effect.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{effect.name}</CardTitle>
          <CardDescription>{effect.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
