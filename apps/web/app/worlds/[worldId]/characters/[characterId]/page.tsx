import { Character } from "roleplayer";
import { CharacterEditor } from "./components/character-editor";
import { classToPlain } from "@/lib/class-to-plain";
import { redirect } from "next/navigation";
import { CampaignRepository } from "@/db/drizzle-campaign-repository";

async function getCampaign(campaignId: string) {
  const campaign = await new CampaignRepository().getCampaign(campaignId);
  return campaign;
}

export default async function CharacterPage({
  params,
}: {
  params: { campaignId: string; characterId: string };
}) {
  async function updateCharacter(
    campaignId: string,
    characterId: string,
    characterUpdate: Partial<Character>
  ) {
    "use server";
    const { entity: campaign } = await new CampaignRepository().getCampaign(
      campaignId
    );
    campaign.setCharacterClasses(characterId, characterUpdate.classes!);
    campaign.setCharacterStats(characterId, characterUpdate.stats!);
    await new CampaignRepository().saveCampaign(campaign);
  }

  const { characterId, campaignId } = params;
  const { entity: campaign } = await getCampaign(campaignId);
  if (!campaign) {
    throw new Error("Could not find campaign");
  }

  const data = campaign.applyEvents();
  const character = data.characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <CharacterEditor
      world={classToPlain(campaign.world)}
      character={classToPlain(character)}
      onSave={async (update) => {
        "use server";
        await updateCharacter(campaignId, characterId, update);
        redirect("../");
      }}
    />
  );
}
