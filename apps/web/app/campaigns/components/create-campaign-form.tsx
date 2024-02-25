import { memoryCampaignRepository } from "../../../storage/campaign-repository";
import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const validateCampaignFormSchema = z.object({
  name: z.string().min(1),
});

export async function CreateCampaignForm() {
  async function createCampaign(formData: FormData) {
    "use server";

    const campaignInput = Object.fromEntries(formData.entries());

    const validationResult =
      validateCampaignFormSchema.safeParse(campaignInput);
    if (!validationResult.success) {
      throw new Error("Campaign name missing");
    }

    const stored = await memoryCampaignRepository.createCampaign(
      validationResult.data.name
    );

    return redirect(`/campaigns/${stored.id}`);
  }

  return (
    <form className="flex flex-col items-start gap-y-2" action={createCampaign}>
      <Input
        type="name"
        id="name"
        name="name"
        placeholder="New campaign name"
      />
      <Button type="submit">Create campaign</Button>
    </form>
  );
}
