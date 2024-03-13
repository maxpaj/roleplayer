import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { CampaignService } from "services/campaign-service";
import { CampaignRecord } from "@/db/schema/campaigns";
import { redirect } from "next/navigation";

export async function InviteAFriendForm({
  campaignId,
}: {
  campaignId: CampaignRecord["id"];
}) {
  async function sendFriendInvite(formData: FormData) {
    "use server";

    const friendInput = Object.fromEntries(formData.entries());

    await new CampaignService().createFriendInvite({
      email: friendInput.email!.toString(),
      userId: 2,
    });

    return redirect(`/campaigns/${campaignId}/invite-a-friend`);
  }

  return (
    <form className="flex items-start gap-x-2" action={sendFriendInvite}>
      <Input type="email" id="email" name="email" placeholder="Enter email" />
      <Button type="submit">Send invite</Button>
    </form>
  );
}
