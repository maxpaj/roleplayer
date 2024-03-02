import { World } from "@repo/rp-lib/world";
import { memoryWorldRepository } from "../../../../../storage/world-repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/multi-select";

async function getWorld(worldId: string) {
  const world = await memoryWorldRepository.getWorld(worldId);
  return world;
}

export default async function CharacterPage({
  params,
}: {
  params: { worldId: string; characterId: string };
}) {
  async function updateCharacter(
    worldId: string,
    characterId: string,
    formData: FormData
  ) {
    "use server";

    memoryWorldRepository.updateCharacter(worldId, characterId, {
      name: formData.get("name"),
      classes: [{ clazz: formData.get("classId") }],
    } as Partial<World>);
  }

  const { characterId, worldId } = params;
  const world = await getWorld(worldId);
  if (!world) {
    throw new Error("Could not find world");
  }

  const data = world.applyEvents();
  const character = data.characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <hr className="my-2" />

      {world.getCharacterLevel(character)}

      <form
        className="flex flex-col gap-2"
        action={async (formData) => {
          "use server";

          await updateCharacter(worldId, character.id, formData);
        }}
      >
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="Name"
          defaultValue={character.name}
        />

        <MultiSelect
          options={[
            {
              label: "Bard",
              value: "bard",
            },
          ]}
          values={[]}
        />

        <Button>Update character</Button>
      </form>
    </div>
  );
}
