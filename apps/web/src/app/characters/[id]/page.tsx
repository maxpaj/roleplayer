import { Character } from "@repo/dnd/core/character/character";

async function getData(id: string) {
  const character: Character = new Character();
  return character;
}

export default async function CharacterPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const data = await getData(id);

  return (
    <div>
      <h1>Character {params.id}</h1>
    </div>
  );
}
