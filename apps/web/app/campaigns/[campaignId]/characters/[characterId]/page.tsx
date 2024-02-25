import { Campaign } from "@repo/rp-lib/campaign";
import { memoryCampaignRepository } from "../../../../../storage/campaign-repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/multi-select";

async function getCampaign(campaignId: string) {
  const campaign = await memoryCampaignRepository.getCampaign(campaignId);

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
    formData: FormData
  ) {
    "use server";

    memoryCampaignRepository.updateCharacter(campaignId, characterId, {
      name: formData.get("name"),
      classes: [{ clazz: formData.get("classId") }],
    } as Partial<Campaign>);
  }

  const { characterId, campaignId } = params;
  const campaign = await getCampaign(campaignId);
  const character = campaign.characters.find((c) => c.id === characterId);

  if (!character) {
    return <>Character not found</>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <hr className="my-2" />

      {campaign.getCharacterLevel(character)}

      <form
        className="flex flex-col gap-2"
        action={async (formData) => {
          "use server";

          await updateCharacter(campaignId, character.id, formData);
        }}
      >
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="Name"
          defaultValue={character.name}
        />

        <MultiSelect
          options={[
            {
              label: "Bard",
              value: "bard",
            },
          ]}
          values={[]}
        />

        <Button>Update character</Button>
      </form>
    </div>
  );
}
