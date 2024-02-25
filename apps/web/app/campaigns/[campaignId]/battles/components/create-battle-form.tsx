import { redirect } from "next/navigation";
import { memoryCampaignRepository } from "../../../../../storage/campaign-repository";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const validateBattleFormSchema = z.object({
  name: z.string().min(1),
});

type CreateBattleFormProps = {
  campaignId: string;
};

export function CreateBattleForm({ campaignId }: CreateBattleFormProps) {
  async function createNewBattle(formData: FormData) {
    "use server";

    const battleInput = Object.fromEntries(formData.entries());

    const validationResult = validateBattleFormSchema.safeParse(battleInput);
    if (!validationResult.success) {
      throw new Error("Battle 'name' missing");
    }

    const battleId = await memoryCampaignRepository.createBattle(campaignId);

    return redirect(`/campaigns/${campaignId}/battles/${battleId}`);
  }

  return (
    <>
      <h1>New battle form</h1>
      <hr className="my-2" />

      <form action={createNewBattle}>
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="New Battle name"
        />

        <Button type="submit">Create new Battle</Button>
      </form>
    </>
  );
}
