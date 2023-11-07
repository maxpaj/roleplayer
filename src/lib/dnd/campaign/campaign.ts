import { Battle, Round } from "../battle/battle";
import { Character } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { roll } from "../dice";
import { Effect } from "../effects";
import { Id, generateId } from "../id";
import { Item } from "../items";

export enum CampaignEventType {
  CharacterStartRound = "CharacterStart",
  CharacterPrimaryAction = "CharacterPrimaryAction",
  CharacterSecondaryAction = "CharacterSecondaryAction",
  CharacterMovement = "CharacterMovement",
  CharacterEndRound = "CharacterEndRound",
  CharacterHealthLoss = "CharacterDefense",
  BattleNewRound = "BattleNewRound",
  CharacterDodge = "CharacterDodge",
  CharacterSpawned = "CharacterSpawned",
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

export class Campaign {
  items: Item[];
  characters: Character[];
  battles: Battle[];
  events: CampaignEvent[];

  constructor(
    items: Item[] = [],
    characters: Character[] = [],
    battles: Battle[] = [],
    events: CampaignEvent[] = []
  ) {
    this.items = items;
    this.characters = characters;
    this.battles = battles;
    this.events = events;
  }

  getCharacter(characterId: Id) {
    const character = this.characters.find((c) => c.id === characterId);

    if (!character) {
      throw new Error(`Could not find character with id ${characterId}`);
    }

    return character;
  }

  getRoundEvents(round: Round) {
    return this.events.filter((e) => e.roundId === round.id);
  }

  getBattleEvents(battle: Battle) {
    return this.events.filter((e) => e.battleId === battle.id);
  }

  getCurrentBattle() {
    return this.battles[this.battles.length - 1];
  }

  getCurrentRound() {
    const battle = this.getCurrentBattle();
    return battle.rounds[battle.rounds.length - 1];
  }

  getItem(itemId: Id) {
    const item = this.items.find((i) => i.id === itemId);

    if (!item) {
      throw new Error("No such item");
    }

    return item;
  }

  getCharacterEffectDamageTaken(defender: Character, attackEffect: Effect) {
    const amount =
      attackEffect.amountStatic + roll(attackEffect.amountVariable);

    return (
      amount *
        defender.getResistanceMultiplier(this.events, attackEffect.element) -
      defender.getResistanceAbsolute(this.events, attackEffect.element)
    );
  }

  characterPerformBattleAction(
    actionType: ActionType,
    eventType: CampaignEventType,
    characterId: string
  ) {
    const currentBattle = this.getCurrentBattle();
    const currentRound = this.getCurrentRound();

    return this.publishCampaignEvent({
      id: generateId("event"),
      actionType,
      eventType,
      characterId: characterId,
      roundId: currentRound?.id,
      battleId: currentBattle?.id,
    });
  }

  performCharacterAttack(
    attacker: Character,
    attackHitRoll: number,
    attackEffects: Effect[],
    defender: Character
  ) {
    const currentBattle = this.getCurrentBattle();
    const currentRound = this.getCurrentRound();
    const hit = defender.getDefense(this.events) > attackHitRoll;

    const events = hit
      ? attackEffects.map((a) => {
          const defenderDamage = this.getCharacterEffectDamageTaken(
            defender,
            a
          );

          return {
            id: generateId("event"),
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
            id: generateId("event"),
            characterId: defender.id,
            actionType: ActionType.Attack,
            eventType: CampaignEventType.CharacterDodge,
            battleId: currentBattle.id,
            roundId: currentRound.id,
          },
        ];

    this.publishCampaignEvent({
      id: generateId("event"),
      characterId: attacker.id,
      actionType: ActionType.Attack,
      eventType: CampaignEventType.CharacterPrimaryAction,
      battleId: currentBattle.id,
      roundId: currentRound.id,
    });

    this.publishCampaignEvent(...events);
  }

  publishCampaignEvent(...events: CampaignEvent[]) {
    events.forEach((e) => console.table(e));
    this.events.push(...events);
    return events;
  }

  logEvent(e: CampaignEvent) {}

  getCharacterRoundEvents(round: Round, characterId: Id) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => re.characterId === characterId);
  }

  characterHasRoundEvent(
    round: Round,
    characterId: Id,
    eventType: CampaignEventType
  ) {
    const roundCharacterEvents = this.getCharacterRoundEvents(
      round,
      characterId
    );

    return roundCharacterEvents.some(
      (c) => c.characterId === characterId && c.eventType === eventType
    );
  }

  addRandomCharacterToCampaign(
    name: string,
    isPlayerControlled: boolean
  ): Character {
    const random = randomCharacter(generateId("character"));
    random.isPlayerControlled = isPlayerControlled;
    random.name = name;

    this.characters.push(random);
    this.events.push({
      id: generateId("event"),
      characterId: random.id,
      actionType: ActionType.None,
      eventType: CampaignEventType.CharacterSpawned,
    });

    return random;
  }
}

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
