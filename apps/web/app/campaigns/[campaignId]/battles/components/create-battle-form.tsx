import { redirect } from "next/navigation";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignService } from "services/campaign-service";
import { CampaignRecord } from "@/db/schema/campaigns";

const validateName = z.object({
  name: z.string().min(1),
});

type CreateBattleFormProps = {
  campaignId: CampaignRecord["id"];
};

export function CreateBattleForm({ campaignId }: CreateBattleFormProps) {
  async function createNewBattle(formData: FormData) {
    "use server";

    const battleInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(battleInput);
    if (!validationResult.success) {
      throw new Error("Battle 'name' missing");
    }

    const battle = await new CampaignService().createBattle(campaignId);
    return redirect(`/campaign/${campaignId}/battles/${battle.id}`);
  }

  return (
    <>
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
