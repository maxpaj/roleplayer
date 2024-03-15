import { getWorldData } from "../actions";
import { CreateCharacterForm } from "../../../characters/components/create-character-form";
import { H3 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

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
      <H3>Characters</H3>
      <Separator className="my-3" />

      <CreateCharacterForm worldId={worldId} />
    </div>
  );
}
