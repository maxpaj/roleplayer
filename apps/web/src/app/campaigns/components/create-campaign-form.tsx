import { memoryCampaignRepository } from "../../../storage/campaign-repository";
import z from "zod";
import { redirect } from "next/navigation";

const validateCampaignFormSchema = z.object({
  name: z.string().min(1),
});

export default async function CreateCampaignForm() {
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
      <input
        className="p-2 text-slate-500"
        type="name"
        id="name"
        name="name"
        placeholder="New campaign name"
      />
      <button type="submit" className="border border-slate-500 px-4 py-2">
        Create campaign
      </button>
    </form>
  );
}
