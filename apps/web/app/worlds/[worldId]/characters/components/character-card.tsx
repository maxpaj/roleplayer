import { H4 } from "@/components/ui/typography";
import { Character } from "@repo/rp-lib/character";
import Link from "next/link";

type CharacterCardProps = {
  worldId: string;
  character: Character;
};

export function CharacterCard({ worldId, character }: CharacterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/characters/${character.id}`}>
      <div className="border border-slate-500 bg-slate-800 py-2 px-3">
        <H4>{character.name}</H4>
        {character.xp} XP
      </div>
    </Link>
  );
}
