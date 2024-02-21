import { Character } from "@repo/dnd-lib/character";
import Image from "next/image";

type CharacterCardProps = {
  character: Character;
};

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <>
      <h1>{character.name}</h1>
      <Image src={character.imageUrl} alt={character.name} />
    </>
  );
}
