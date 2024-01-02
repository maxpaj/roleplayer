import { Character } from "@repo/dnd/core/character/character";

async function getData() {
  const characters: Character[] = [];
  return characters;
}

export default async function Characters({}) {
  const characters = await getData();
  return (
    <div>
      <h1>Characters</h1>
      <div>
        {characters.map((c) => (
          <>{c.name}</>
        ))}
      </div>
    </div>
  );
}
