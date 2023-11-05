import { Id, generateId } from "@/lib/dnd/id";
import {
  ActionType,
  Campaign,
  CampaignEvent,
  CampaignEventType,
} from "../campaign/campaign";
import { Character } from "../character/character";
import { getCharacterInitiative } from "../character/character-stats";
import { Effect, ElementType } from "../effects";

export type Round = {
  id: Id;
};

export type Battle = {
  id: Id;
  characters: BattleCharacter[];
  rounds: Round[];
};

export type BattleCharacter = {
  characterId: Id;
  initiative: number;
};

export function hasRolledForInitiative(battle: Battle) {
  return battle.characters.every((c) => c.initiative != 0);
}

export function currentRoundCanEnd(campaign: Campaign) {
  const currentBattle = getCurrentBattle(campaign);

  if (!currentBattle.characters.length) {
    return false;
  }

  const currentRound = getCurrentRound(campaign);
  const events = getRoundEvents(currentRound, campaign.events);

  return currentBattle.characters.every((c) =>
    events.some(
      (e) =>
        e.eventType === CampaignEventType.CharacterEndRound &&
        e.characterId === c.characterId
    )
  );
}

export function getRoundEvents(round: Round, events: CampaignEvent[]) {
  return events.filter((e) => e.roundId === round.id);
}

export function getCharacterRoundEvents(
  campaign: Campaign,
  round: Round,
  characterId: Id
) {
  const roundEvents = getRoundEvents(round, campaign.events);
  return roundEvents.filter((re) => re.characterId === characterId);
}

export function characterHasRoundEvent(
  campaign: Campaign,
  round: Round,
  characterId: Id,
  eventType: CampaignEventType
) {
  const roundCharacterEvents = getCharacterRoundEvents(
    campaign,
    round,
    characterId
  );

  return roundCharacterEvents.some(
    (c) => c.characterId === characterId && c.eventType === eventType
  );
}

export function getCurrentBattleNextRound(campaign: Campaign): Campaign {
  const battle = getCurrentBattle(campaign);
  const nextRoundId = `round-${battle.rounds.length + 1}`;

  battle.rounds = [...battle.rounds, { id: nextRoundId }];

  return {
    ...campaign,
    battles: [...campaign.battles],
    events: [
      ...campaign.events,
      {
        id: generateId(),
        eventType: CampaignEventType.BattleNewRound,
        actionType: ActionType.None,
        characterId: "system",
        roundId: nextRoundId,
        battleId: battle.id,
      },
    ],
  };
}

export function performCharacterAttack(
  campaign: Campaign,
  attacker: Character,
  attackHitRoll: number,
  attackEffects: Effect[],
  defender: Character
): Campaign {
  const currentBattle = getCurrentBattle(campaign);
  const currentRound = getCurrentRound(campaign);

  campaign.events.push({
    id: generateId(),
    characterId: attacker.id,
    actionType: ActionType.Attack,
    eventType: CampaignEventType.CharacterPrimaryAction,
    battleId: currentBattle.id,
    roundId: currentRound.id,
  });

  const hit = defender.getDefense(campaign.events) > attackHitRoll;

  const events = hit
    ? attackEffects.map((a) => {
        const defenderDamage = getCharacterEffectDamageTaken(
          campaign,
          defender,
          a.elementType,
          a.amount
        );

        return {
          id: generateId(),
          characterId: defender.id,
          actionType: ActionType.Attack,
          eventType: CampaignEventType.CharacterHealthLoss,
          amount: defenderDamage,
          battleId: currentBattle.id,
          roundId: currentRound.id,
        };
      })
    : [
        {
          id: generateId(),
          characterId: defender.id,
          actionType: ActionType.Attack,
          eventType: CampaignEventType.CharacterDodge,
          battleId: currentBattle.id,
          roundId: currentRound.id,
        },
      ];

  campaign.events.push(...events);

  return campaign;
}

export function getItem(campaign: Campaign, itemId: Id) {
  const item = campaign.items.find((i) => i.id === itemId);

  if (!item) {
    throw new Error("No such item");
  }

  return item;
}

export function addCharacterToCurrentBattle(
  campaign: Campaign,
  character: Character
) {
  const currentBattle = campaign.battles[campaign.battles.length - 1];
  if (!currentBattle) {
    throw new Error("No battle in campaign");
  }

  currentBattle.characters = [
    ...currentBattle.characters,
    {
      characterId: character.id,
      initiative: getCharacterInitiative(character),
    },
  ];

  return {
    ...campaign,
    battles: [...campaign.battles, currentBattle],
  };
}

export function currentCharacterTurn(campaign: Campaign) {
  const battle = getCurrentBattle(campaign);
  const round = getCurrentRound(campaign);

  const charactersNotActedCurrentRound = battle.characters.filter(
    (battleChar) => {
      const currentRoundEvents = getCharacterRoundEvents(
        campaign,
        round,
        battleChar.characterId
      );

      const hasActed = currentRoundEvents.some(
        (e) =>
          e.characterId === battleChar.characterId &&
          e.eventType === CampaignEventType.CharacterEndRound
      );

      return !hasActed;
    }
  );

  const sorted = charactersNotActedCurrentRound.sort(
    (a, b) => b.initiative - a.initiative
  );

  return sorted[0];
}

export function getBattleEvents(campaign: Campaign, battle: Battle) {
  return campaign.events.filter((e) => e.battleId === battle.id);
}

export function getCurrentBattle(campaign: Campaign) {
  return campaign.battles[campaign.battles.length - 1];
}

export function getCurrentRound(campaign: Campaign) {
  const battle = getCurrentBattle(campaign);
  return battle.rounds[battle.rounds.length - 1];
}

export function characterPerformBattleAction(
  campaign: Campaign,
  actionType: ActionType,
  eventType: CampaignEventType,
  characterId: string
) {
  const currentBattle = getCurrentBattle(campaign);
  const currentRound = getCurrentRound(campaign);

  campaign.events.push({
    id: generateId(),
    actionType,
    eventType,
    characterId: characterId,
    roundId: currentRound?.id,
    battleId: currentBattle?.id,
  });

  return campaign;
}

function getCharacterEffectDamageTaken(
  campaign: Campaign,
  defender: Character,
  damageType: ElementType,
  amount: number
) {
  return (
    amount * defender.getResistanceMultiplier(campaign.events, damageType) -
    defender.getResistanceAbsolute(campaign.events, damageType)
  );
}
