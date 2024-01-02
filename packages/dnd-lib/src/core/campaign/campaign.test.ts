import { Campaign } from "./campaign";

describe("Campaign", () => {
  describe("addRandomCharacterToCampaign", () => {
    it("adding a new character should add another to the campaign", () => {
      const campaign: Campaign = new Campaign([], [], [], []);
      campaign.addRandomCharacterToCampaign("123", false);
      expect(campaign.characters.length).toBe(1);
    });
  });
});
