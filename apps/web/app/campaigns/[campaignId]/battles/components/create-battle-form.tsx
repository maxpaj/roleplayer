import { redirect } from "next/navigation";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H4 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";
import { CampaignRecord } from "@/db/schema/campaigns";

const validateBattleFormSchema = z.object({
  name: z.string().min(1),
});

type CreateBattleFormProps = {
  campaignId: CampaignRecord["id"];
};

export function CreateBattleForm({ campaignId }: CreateBattleFormProps) {
  async function createNewBattle(formData: FormData) {
    "use server";

    const battleInput = Object.fromEntries(formData.entries());

    const validationResult = validateBattleFormSchema.safeParse(battleInput);
    if (!validationResult.success) {
      throw new Error("Battle 'name' missing");
    }

    const battleId = await new CampaignRepository().createBattle(campaignId);

    return redirect(`/campaign/${campaignId}/battles/${battleId}`);
  }

  return (
    <>
      <H4>New battle</H4>
      <Separator />

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
