import { Monster } from "roleplayer";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

type MonsterCardProps = {
  monster: Monster;
  worldId: string;
};

export function MonsterCard({ worldId, monster }: MonsterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/monsters/${monster.id}`}>
      <Card className="w-[100px] h-[100px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{monster.name}</CardTitle>
          <CardDescription>{monster.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
