import { Character } from "@repo/dnd-lib/character";
import { CreateCharacterForm } from "./components/create-character-form";

async function getData() {
  const characters: Character[] = [];
  return characters;
}

export default async function Characters({}) {
  const characters = await getData();

  return (
    <div>
      <h1>Characters</h1>
      <CreateCharacterForm />
      <div>
        {characters.map((c) => (
          <>{c.name}</>
        ))}
      </div>
    </div>
  );
}
