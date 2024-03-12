import { Campaign, Character, DefaultRuleSet, World } from "roleplayer";
import { CharacterEditor } from "./components/character-editor";
import { classToPlain } from "@/lib/class-to-plain";
import { redirect } from "next/navigation";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord } from "@/db/schema/characters";

async function getCampaign(campaignId: CampaignRecord["id"]) {
  return await new CampaignRepository().getCampaign(campaignId);
}

export default async function CharacterPage({
  params: { campaignId: id, characterId: cid },
}: {
  params: { campaignId: string; characterId: string };
}) {
  const campaignId = parseInt(id);
  const characterId = parseInt(cid);

  async function updateCharacter(
    campaignId: CampaignRecord["id"],
    characterId: CharacterRecord["id"],
    characterUpdate: Partial<Character>
  ) {
    "use server";
    const campaignData = await new CampaignRepository().getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("Cannot find campaign");
    }

    const campaign = new Campaign({
      ...campaignData.campaign,
      world: new World({ ...campaignData.world, ruleset: DefaultRuleSet }),
    });

    campaign.setCharacterClasses(characterId, characterUpdate.classes!);
    campaign.setCharacterStats(characterId, characterUpdate.stats!);

    await new CampaignRepository().saveCampaignEvents(
      campaignId,
      campaign.events
    );
  }

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    throw new Error("Could not find campaign");
  }

  const { campaign, world } = campaignData;
  const campaignInstance = new Campaign({
    ...campaign,
    world: new World({ ...world, ruleset: DefaultRuleSet }),
  });

  const data = campaignInstance.applyEvents();
  const character = data.characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <CharacterEditor
      world={classToPlain(campaignInstance.world)}
      character={classToPlain(character)}
      onSave={async (update) => {
        "use server";
        await updateCharacter(campaignId, characterId, update);
        redirect("../");
      }}
    />
  );
}
