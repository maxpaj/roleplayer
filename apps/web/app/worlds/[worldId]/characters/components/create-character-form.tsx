import z from "zod";
import { memoryWorldRepository } from "../../../../../storage/world-repository";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewCharacterProps = {
  worldId: string;
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

    const characterId = await memoryWorldRepository.createCharacter(
      worldId,
      validationResult.data.name
    );

    return redirect(`/worlds/${worldId}/characters/${characterId}`);
  }

  return (
    <>
      <form action={createNewCharacter}>
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