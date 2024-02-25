import { CreateCharacterForm } from "./components/create-character-form";
import { CharacterCard } from "./components/character-card";
import { memoryCampaignRepository } from "../../../../storage/campaign-repository";

async function getData(campaignId: string) {
  const campaign = await memoryCampaignRepository.getCampaign(campaignId);
  return campaign.characters;
}

export default async function CharactersPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId } = params;
  const characters = await getData(campaignId);

  return (
    <div>
      <h1>Create a new character</h1>
      <hr className="my-2" />

      <CreateCharacterForm campaignId={params.campaignId} />
      <hr className="my-2" />

      <div className="flex gap-2">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            campaignId={campaignId}
          />
        ))}
      </div>
    </div>
  );
}
