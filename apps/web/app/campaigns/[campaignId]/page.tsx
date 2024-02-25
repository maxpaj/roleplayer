import { getCampaign } from "./actions";
import { DeleteCampaignButton } from "./components/delete-campaign-button";
import { CreateCharacterButton } from "./components/create-character-button";
import { CharacterCard } from "./characters/components/character-card";

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
    <div>
      <h1>{campaign.name}</h1>
      <hr className="my-2" />

      <div className="flex justify-between my-2">
        <CreateCharacterButton campaignId={campaign.id} />
        <DeleteCampaignButton campaignId={campaign.id} />
      </div>

      <h2>Characters</h2>
      <hr className="my-2" />

      <div className="flex gap-2">
        {campaign.characters.map((character) => (
          <CharacterCard
            key={character.id}
            campaignId={campaign.id}
            character={character}
          />
        ))}
      </div>

      <pre>{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  );
}
