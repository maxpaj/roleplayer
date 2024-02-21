import CreateCampaignForm from "./components/create-campaign-form";
import CampaignCard from "./components/campaign-card";
import { memoryCampaignRepository } from "../../storage/campaign-repository";

async function getData() {
  const campaigns = await memoryCampaignRepository.getAll();
  return campaigns;
}

export default async function CampaignsPage({}) {
  const campaigns = await getData();

  return (
    <div>
      <h1>Campaigns</h1>

      <div className="mb-2 flex gap-2">
        {campaigns.map((campaign) => (
          <CampaignCard campaign={campaign} />
        ))}
      </div>

      <CreateCampaignForm />
    </div>
  );
}
