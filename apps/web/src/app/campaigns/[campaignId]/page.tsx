import CharacterCard from "./characters/components/character-card";
import { memoryCampaignRepository } from "../../../storage/campaign-repository";

async function getCampaign(id: string) {
  const campaign = await memoryCampaignRepository.getCampaign(id);

  return campaign;
}

export default async function CampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    return <>Not found!</>;
  }

  return (
    <>
      <h1>Campaign {campaign.name}</h1>
      <hr />
      <h2>Characters</h2>
      {campaign.getCharacters().map((character) => {
        <CharacterCard character={character} />;
      })}
    </>
  );
}
