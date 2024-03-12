import z from "zod";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldRepository } from "@/db/repository/drizzle-world-repository";
import { WorldRecord } from "@/db/schema/worlds";

type NewCharacterProps = {
  worldId: WorldRecord["id"];
};

const validateCharacterFormSchema = z.object({
  name: z.string().min(1),
});

export function CreateCharacterForm({ worldId }: NewCharacterProps) {
  async function createNewCharacter(formData: FormData) {
    "use server";

    const characterInput = Object.fromEntries(formData.entries());

    const validationResult =
      validateCharacterFormSchema.safeParse(characterInput);
    if (!validationResult.success) {
      throw new Error("Character 'name' missing");
    }

    const characterId = await new WorldRepository().createCharacter(
      worldId,
      validationResult.data.name
    );

    return redirect(`/worlds/${worldId}/characters/${characterId}`);
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
