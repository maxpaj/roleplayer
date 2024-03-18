import { getWorldData } from "../actions";
import { CreateCharacterForm } from "../../../characters/components/create-character-form";
import { H3 } from "@/components/ui/typography";
import { Divider } from "@/components/ui/divider";

export default async function CharactersPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(id);
  if (!worldData) {
    return <>World not found!</>;
  }

  return (
    <div>
      <H3>Characters</H3>
      <Divider className="my-3" />

      <CreateCharacterForm worldId={worldId} />
    </div>
  );
}
