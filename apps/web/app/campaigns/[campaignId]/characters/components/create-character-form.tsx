import z from "zod";
import { memoryCampaignRepository } from "../../../../../storage/campaign-repository";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewCharacterProps = {
  campaignId: string;
};

const validateCharacterFormSchema = z.object({
  name: z.string().min(1),
});

export function CreateCharacterForm({ campaignId }: NewCharacterProps) {
  async function createNewCharacter(formData: FormData) {
    "use server";

    const characterInput = Object.fromEntries(formData.entries());

    const validationResult =
      validateCharacterFormSchema.safeParse(characterInput);
    if (!validationResult.success) {
      throw new Error("Character 'name' missing");
    }

    const characterId = await memoryCampaignRepository.createCharacter(
      campaignId,
      validationResult.data.name
    );

    return redirect(`/campaigns/${campaignId}/characters/${characterId}`);
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
