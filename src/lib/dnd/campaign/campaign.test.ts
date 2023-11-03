import { Campaign, addRandomCharacterToCampaign } from "./campaign";

describe("adding a new character should add another to the campaign", () => {
  const campaign: Campaign = {
    battles: [],
    characters: [],
    events: [],
  };

  const [added] = addRandomCharacterToCampaign(campaign, false, "123");

  expect(added.characters.length).toBe(1);
});
