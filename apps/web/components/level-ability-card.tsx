import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ActionDefinition, ClassLevelProgression } from "roleplayer";
import { WorldRecord } from "@/db/schema/worlds";
import Link from "next/link";

type LevelAbilityCardProps = {
  ability: ActionDefinition;
  levelProgression: ClassLevelProgression;
  worldId: WorldRecord["id"];
};

export function LevelAbilityCard({ worldId, ability, levelProgression }: LevelAbilityCardProps) {
  return (
    <Link href={`/worlds/${worldId}/actions/${ability.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{ability.name}</CardTitle>
          <CardDescription>{ability.description}</CardDescription>
          <CardDescription>Unlocks at level {levelProgression.unlockedAtLevel}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
