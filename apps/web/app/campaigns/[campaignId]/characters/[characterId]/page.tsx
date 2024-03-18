import { EventCard } from "@/components/event-card";
import { H4, Muted } from "@/components/ui/typography";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord } from "@/db/schema/characters";
import { classToPlain } from "@/lib/class-to-plain";
import { getCampaign } from "app/campaigns/actions";
import { CharacterEditor } from "app/characters/components/character-editor";
import { redirect } from "next/navigation";
import { Campaign, CampaignEventWithRound, Character, DefaultRuleSet, World } from "roleplayer";
import { CampaignService, getWorldFromCampaignData } from "services/campaign-service";

export default async function CampaignCharacterPage({
  params: { campaignId: id, characterId: cid },
}: {
  params: { campaignId: string; characterId: string };
}) {
  const campaignId = id;
  const characterId = cid;

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
      ...campaignData,
      world: getWorldFromCampaignData(campaignData),
      events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
    });

    campaign.setCharacterClasses(characterId, characterUpdate.classes!);
    campaign.setCharacterStats(characterId, characterUpdate.stats!);

    await new CampaignService().saveCampaignEvents(campaignId, campaign.events);
  }

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    throw new Error("Could not find campaign");
  }

  const { characters, events } = campaignData;

  const campaignInstance = new Campaign({
    ...campaignData,
    world: getWorldFromCampaignData(campaignData),
    events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
  });

  const data = campaignInstance.getCampaignStateFromEvents();
  const characterFromEvents = data.characters.find((c) => c.id === characterId);
  const character = characters.find((c) => c.id === characterId);
  const characterEvents = events.filter((e) => e.characterId === characterId);

  if (!character || !characterFromEvents) {
    return <>Character not found in campaign</>;
  }

  return (
    <>
      <CharacterEditor
        world={classToPlain(campaignInstance.world)}
        characterFromEvents={classToPlain(characterFromEvents)}
        onSave={async (update) => {
          "use server";
          await updateCharacter(campaignId, characterId, update);
          redirect("../");
        }}
        characterLevel={campaignInstance.getCharacterLevel(characterFromEvents)}
      />

      <H4 className="my-2">Events</H4>
      <div className="flex flex-wrap gap-2">
        {characterEvents.map((e) => (
          <EventCard key={e.id} event={e} campaignId={campaignId} />
        ))}
      </div>

      {characterEvents.length === 0 && <Muted>No events yet for this character</Muted>}
    </>
  );
}
