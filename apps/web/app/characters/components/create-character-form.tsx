import z from "zod";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldService } from "services/world-service";
import { WorldRecord } from "@/db/schema/worlds";
import { DEFAULT_USER_ID } from "@/db/index";
import { CampaignRecord } from "@/db/schema/campaigns";

type NewCharacterProps = {
  worldId: WorldRecord["id"];
  campaignId?: CampaignRecord["id"];
};

const validateName = z.object({
  name: z.string().min(1),
});

export function CreateCharacterForm({
  worldId,
  campaignId,
}: NewCharacterProps) {
  async function createNewCharacter(formData: FormData) {
    "use server";

    const characterInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(characterInput);
    if (!validationResult.success) {
      throw new Error("Character 'name' missing");
    }

    const characterId = await new WorldService().createCharacter(
      {
        name: validationResult.data.name,
        worldId: worldId,
        userId: DEFAULT_USER_ID,
      },
      campaignId
    );

    return campaignId
      ? redirect(`/campaigns/${campaignId}/characters/${characterId.id}`)
      : redirect(`/worlds/${worldId}/characters/${characterId.id}`);
  }

  return (
    <>
      <form action={createNewCharacter} className="flex gap-2">
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="New character name"
        />

        <Button type="submit">Create new character</Button>
      </form>
    </>
  );
}
