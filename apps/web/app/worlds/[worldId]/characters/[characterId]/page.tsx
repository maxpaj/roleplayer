import { WorldService } from "services/world-service";
import { DEFAULT_USER_ID } from "@/db/index";
import { H3, Paragraph } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

export default async function CharacterPage({
  params: { worldId: id, characterId: cid },
}: {
  params: { worldId: string; characterId: string };
}) {
  const worldId = parseInt(id);
  const characterId = parseInt(cid);

  const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, worldId);

  if (!worldData) {
    return <>World not found</>;
  }

  const { characters } = worldData;
  const character = characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <>
      <H3>{character.name}</H3>
      <Separator className="my-3" />
      <Paragraph>{character.description}</Paragraph>
    </>
  );
}
