import { Character } from "@repo/dnd-lib/character";

async function getCharacter(id: string) {
  const character: Character = new Character();
  return character;
}

export default async function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  const { characterId: id } = params;
  const character = await getCharacter(id);

  return (
    <div>
      <h1>Character {character.name}</h1>
    </div>
  );
}
