import { WorldService } from "services/world-service";
import { DEFAULT_USER_ID } from "@/db/data";
import { H3, Paragraph } from "@/components/ui/typography";
import { Divider } from "@/components/ui/divider";

export default async function CharacterPage({
  params: { worldId, characterId },
}: {
  params: { worldId: string; characterId: string };
}) {
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
      <Divider className="my-3" />
      <Paragraph>{character.description}</Paragraph>
    </>
  );
}
