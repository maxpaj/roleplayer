import { getWorld } from "../actions";
import { CreateCharacterForm } from "./components/create-character-form";
import { H2 } from "@/components/ui/typography";

export default async function CharactersPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <div>
      <H2 className="mb-3">Create a new character</H2>
      <CreateCharacterForm worldId={params.worldId} />
    </div>
  );
}
