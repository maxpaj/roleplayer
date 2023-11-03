import { Battle } from "../battle/battle";
import { Character } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Id } from "../id";

export enum CampaignEventType {
  CharacterStart = "character-start",
  CharacterPrimaryAction = "character-primary-action",
  CharacterBonusAction = "character-secondary-action",
  CharacterMovement = "character-movement",
  CharacterEndRound = "character-end",
  BattleNewRound = "battle-new-round",
}

export enum ActionType {
  Attack = "attack",
  Sprint = "sprint",
  Jump = "jump",
  Cantrip = "cantrip",
  Spell = "spell",
  Item = "item",
  Equipment = "equipment",
  None = "none",
}

export type Action = {};

export type CharacterAction = {
  characterId: string;
  action: Action;
};

export type Campaign = {
  characters: Character[];
  battles: Battle[];
  events: CampaignEvent[];
};

export type CampaignEvent = {
  id: Id;
  characterId: Id;
  roundId: Id;
  battleId: Id;
  eventType: CampaignEventType;
  actionType: ActionType;
};

export function getCharacter(campaign: Campaign, characterId: Id) {
  const character = campaign.characters.find((c) => c.id === characterId);

  if (!character) {
    throw new Error(`Could not find character with id ${characterId}`);
  }

  return character;
}

export function addRandomCharacterToCampaign(
  campaign: Campaign,
  isPlayerControlled: boolean,
  characterId: Id
): [Campaign, Character] {
  const random = randomCharacter(characterId);
  random.isPlayerControlled = isPlayerControlled;
  random.name = isPlayerControlled ? "New character" : "Monster";

  const updated = {
    ...campaign,
    characters: [...campaign.characters, random],
  };

  return [updated, random];
}
