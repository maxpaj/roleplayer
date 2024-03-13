import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";
import { CampaignService } from "services/campaign-service";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord } from "@/db/schema/characters";
import { classToPlain } from "@/lib/class-to-plain";
import { getCampaign } from "app/campaigns/actions";
import { CharacterEditor } from "app/characters/components/character-editor";
import { redirect } from "next/navigation";
import { Campaign, Character, DefaultRuleSet, World } from "roleplayer";

export default async function CampaignCharacterPage({
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
    const campaignData = await new CampaignService().getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("Cannot find campaign");
    }

    const campaign = new Campaign({
      ...campaignData.campaign,
      world: new World({ ...campaignData.world, ruleset: DefaultRuleSet }),
    });

    campaign.setCharacterClasses(characterId, characterUpdate.classes!);
    campaign.setCharacterStats(characterId, characterUpdate.stats!);

    await new CampaignService().saveCampaignEvents(campaignId, campaign.events);
  }

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    throw new Error("Could not find campaign");
  }

  const { campaign, world, characters, events } = campaignData;
  const campaignInstance = new Campaign({
    ...campaign,
    world: new World({ ...world, ruleset: DefaultRuleSet }),
  });

  const data = campaignInstance.applyEvents();
  const characterFromEvents = data.characters.find((c) => c.id === characterId);
  const character = characters.find((c) => c.id === characterId);
  const characterEvents = events.filter((e) => e.characterId === characterId);

  if (!character) {
    return <>Character not found in campaign</>;
  }

  return (
    <>
      <CharacterEditor
        world={classToPlain(campaignInstance.world)}
        characterFromEvents={classToPlain(
          characterFromEvents || new Character({ name: character.name })
        )}
        onSave={async (update) => {
          "use server";
          await updateCharacter(campaignId, characterId, update);
          redirect("../");
        }}
      />

      <H3>Events</H3>
      {characterEvents.map((e) => (
        <>{e.type}</>
      ))}
      {characterEvents.length === 0 && (
        <Muted>No events yet for this character</Muted>
      )}
    </>
  );
}
