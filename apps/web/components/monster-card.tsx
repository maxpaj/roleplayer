import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { ActorAggregated } from "services/world-service";

type MonsterCardProps = {
  monster: ActorAggregated;
  worldId: string;
};

export function MonsterCard({ worldId, monster }: MonsterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/monsters/${monster.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{monster.name}</CardTitle>
          <CardDescription>{monster.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
