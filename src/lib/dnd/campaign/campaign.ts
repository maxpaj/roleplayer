import { Battle } from "../battle/battle";
import { Character } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Id } from "../id";
import { Item } from "../items";

export enum CampaignEventType {
  CharacterStart = "CharacterStart",
  CharacterPrimaryAction = "CharacterPrimaryAction",
  CharacterSecondaryAction = "CharacterSecondaryAction",
  CharacterMovement = "CharacterMovement",
  CharacterEndRound = "CharacterEndRound",
  CharacterHealthLoss = "CharacterDefense",
  BattleNewRound = "BattleNewRound",
  CharacterDodge = "CharacterDodge",
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
  items: Item[];
  characters: Character[];
  battles: Battle[];
  events: CampaignEvent[];
};

export type CampaignEvent = {
  id: Id;
  eventType: CampaignEventType;
  actionType: ActionType;

  roundId?: Id;
  battleId?: Id;
  weaponId?: Id;
  spellId?: Id;
  characterId?: Id;
  targetId?: Id;
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
