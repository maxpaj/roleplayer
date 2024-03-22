import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { WorldRecord } from "@/db/schema/worlds";
import { ActorAggregated } from "services/world-service";

type CharacterCardProps = {
  worldId: WorldRecord["id"];
  character: ActorAggregated;
};

export function CharacterCard({ worldId, character }: CharacterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/characters/${character.id}`}>
      <Card className="h-[100px] w-[150px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{character.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
