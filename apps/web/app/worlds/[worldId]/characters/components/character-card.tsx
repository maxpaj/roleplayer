import { Character } from "@repo/rp-lib/character";
import Image from "next/image";
import Link from "next/link";

type CharacterCardProps = {
  worldId: string;
  character: Character;
};

export function CharacterCard({ worldId, character }: CharacterCardProps) {
  return (
    <Link href={`/worlds/${worldId}/characters/${character.id}`}>
      <div className="border border-slate-500 bg-slate-800 p-2">
        <h1>{character.name}</h1>
        <Image src={character.imageUrl} alt={character.name} />
      </div>
    </Link>
  );
}
