import { deleteWorld, getWorld } from "./actions";
import { DeleteWorldButton } from "./components/delete-world-button";
import { CreateCharacterButton } from "./components/create-character-button";
import { CharacterCard } from "./characters/components/character-card";
import { redirect } from "next/navigation";

export default async function WorldPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const world = await getWorld(id);
  const worldData = world.applyEvents();

  if (!world) {
    return <>Not found!</>;
  }

  return (
    <div>
      <h1>{world.name}</h1>
      <hr className="my-2" />

      <div className="flex justify-between my-2">
        <CreateCharacterButton worldId={world.id} />
        <DeleteWorldButton
          worldId={world.id}
          onDeleteConfirm={async () => {
            await deleteWorld(world.id);
            redirect("/worlds/");
          }}
        />
      </div>

      <h2>Characters</h2>
      <hr className="my-2" />

      <div className="flex gap-2">
        {worldData.characters.map((character) => (
          <CharacterCard
            key={character.id}
            worldId={world.id}
            character={character}
          />
        ))}
      </div>

      <pre>{JSON.stringify(world, null, 2)}</pre>
    </div>
  );
}
