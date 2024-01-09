import { Campaign } from "@repo/dnd-lib/campaign";
import Link from "next/link";
import CreateCampaignForm from "./components/create-campaign-form";
import { generateId } from "@repo/dnd-lib/id";

async function getData() {
  const campaigns: Campaign[] = [
    new Campaign(generateId("campaign"), "New campaign", [], [], []),
  ];
  return campaigns;
}

export default async function CampaignsPage({}) {
  const campaigns = await getData();

  return (
    <div>
      <h1>Campaign</h1>
      <CreateCampaignForm />
      {campaigns.map((campaign) => {
        return <Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link>;
      })}
    </div>
  );
}
