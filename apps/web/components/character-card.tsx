import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Character } from "roleplayer";
import Link from "next/link";

type CharacterCardProps = {
  worldId: string;
  character: Character;
};

export function CharacterCard({ worldId, character }: CharacterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/characters/${character.id}`}>
      <Card className="w-[100px] h-[100px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{character.name}</CardTitle>
          <CardDescription>
            {character.classes.map((c) => c.level)}
          </CardDescription>
        </CardHeader>
        <CardContent>{character.description}</CardContent>
      </Card>
    </Link>
  );
}
