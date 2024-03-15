import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CharacterRecord } from "@/db/schema/characters";
import { WorldRecord } from "@/db/schema/worlds";

type CharacterCardProps = {
  worldId: WorldRecord["id"];
  character: CharacterRecord;
};

export function CharacterCard({ worldId, character }: CharacterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/characters/${character.id}`}>
      <Card className="w-[150px] h-[100px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{character.name}</CardTitle>
        </CardHeader>
        <CardContent>{character.description}</CardContent>
      </Card>
    </Link>
  );
}
