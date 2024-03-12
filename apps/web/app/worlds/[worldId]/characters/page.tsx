import { getWorldData } from "../actions";
import { CreateCharacterForm } from "./components/create-character-form";
import { H2 } from "@/components/ui/typography";

export default async function CharactersPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const worldId = parseInt(id);
  const worldData = await getWorldData(parseInt(id));
  if (!worldData) {
    return <>World not found!</>;
  }

  return (
    <div>
      <H2 className="mb-3">Create a new character</H2>
      <CreateCharacterForm worldId={worldId} />
    </div>
  );
}
