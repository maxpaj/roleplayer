import { EventsTable } from "@/components/events-table";
import { H4, Muted } from "@/components/ui/typography";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord } from "@/db/schema/characters";
import { getCampaign } from "app/campaigns/actions";
import { Actor, Campaign, CampaignEventWithRound, DnDRuleset, World } from "roleplayer";
import { CampaignService } from "services/campaign-service";
import { WorldService } from "services/world-service";
import { ClientCharacterEditor } from "../components/client-character-editor";

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
    characterUpdate: Partial<Actor>
  ) {
    "use server";
    const campaignData = await new CampaignService().getCampaign(campaignId);
    if (!campaignData) {
      throw new Error("Cannot find campaign");
    }

    const worldData = await new WorldService().getWorld(campaignData.userId, campaignData.world.id);
    if (!worldData) {
      throw new Error("Cannot find world");
    }

    const campaign = new Campaign({
      ...campaignData,
      world: new World(new DnDRuleset(), worldData.name, worldData as unknown as Partial<World>),
      events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
    });

    campaign.setCharacterClasses(characterId, characterUpdate.classes!);
    campaign.setCharacterStats(characterId, characterUpdate.stats!);

    (characterUpdate.inventory || []).map((i) => campaign.addCharacterItem(characterId, i.id));

    await new CampaignService().saveCampaignEvents(campaignId, campaign.events);
  }

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    throw new Error("Could not find campaign");
  }

  const worldData = await new WorldService().getWorld(campaignData.userId, campaignData.world.id);
  if (!worldData) {
    throw new Error("Cannot find world");
  }

  const { characters, events } = campaignData;

  const character = characters.find((c) => c.id === characterId);
  const characterEvents = events.filter((e) => e.characterId === characterId);

  if (!character) {
    return <>Character not found in campaign</>;
  }

  return (
    <>
      <ClientCharacterEditor campaignData={campaignData} worldData={worldData} characterId={character.id} />

      <H4 className="my-2">History</H4>
      <EventsTable events={characterEvents} />

      {characterEvents.length === 0 && <Muted>No events yet for this character</Muted>}
    </>
  );
}
