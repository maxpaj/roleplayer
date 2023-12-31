import { Battle, Round } from "../battle/battle";
import { ActionType, Spell } from "../character/character";
import { Character } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Effect } from "../interaction/effect";
import { Id, generateId } from "../id";
import { Item } from "../item/item";
import { Status } from "../interaction/status";

export enum CampaignEventType {
  Unknown = "Unknown",
  NewRound = "NewRound",
  CharacterStartRound = "CharacterStart",
  CharacterPrimaryAction = "CharacterPrimaryAction",
  CharacterSecondaryAction = "CharacterSecondaryAction",
  CharacterMovement = "CharacterMovement",
  CharacterEndRound = "CharacterEndRound",
  CharacterDodge = "CharacterDodge",
  CharacterSpawned = "CharacterSpawned",
  CharacterSpellGain = "CharacterGainSpell",
  CharacterPermanentHealthChange = "CharacterPermanentHealthChange",
  CharacterItemGain = "CharacterGainItem",
  CharacterDespawn = "CharacterDespawn",
  CharacterHealthChangeAbsolute = "CharacterHealthChangeAbsolute",
  CharacterHealthChangeRelative = "CharacterHealthChangeRelative",
  CharacterPositionChange = "CharacterPositionChange",
  CharacterMoveSpeedChange = "CharacterMoveSpeedChange",
  CharacterStatusGain = "CharacterStatusGain",
}

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type CampaignEvent = {
  id: Id;
  eventType: CampaignEventType;

  actionType?: ActionType;
  amount?: number;
  targetPosition?: Position;

  roundId?: Id;
  battleId?: Id;
  statusId?: Id;
  spellId?: Id;
  characterId?: Id;
  targetId?: Id;
  itemId?: Id;
};

export class Campaign {
  items: Item[];
  characters: Character[];
  battles: Battle[];
  events: CampaignEvent[];
  spells: Spell[];
  rounds: Round[];
  statuses: Status[];

  constructor(
    items: Item[] = [],
    characters: Character[] = [],
    battles: Battle[] = [],
    events: CampaignEvent[] = [],
    spells: Spell[] = [],
    rounds: Round[] = [],
    statuses: Status[] = []
  ) {
    this.items = items;
    this.characters = characters;
    this.battles = battles;
    this.events = events;
    this.spells = spells;
    this.rounds = rounds;
    this.statuses = statuses;
  }

  nextRound() {
    const next = { id: `round-${this.rounds.length + 1}` };
    this.rounds.push(next);
    return next;
  }

  getCharacter(characterId: Id) {
    const character = this.characters.find((c) => c.id === characterId);
    if (!character) {
      throw new Error(`Could not find character with id ${characterId}`);
    }

    return character;
  }

  getCharacterFromEvents(characterId: Id) {
    const characterEvents = this.events.filter(
      (c) => c.characterId === characterId
    );

    const character = new Character();
    characterEvents.forEach((event) => {
      return character.applyEvent(event, this);
    }, character);

    return character;
  }

  getRoundEvents(round: Round) {
    return this.events.filter((e) => e.roundId === round.id);
  }

  getBattleEvents(battle: Battle) {
    return this.events.filter((e) => e.battleId === battle.id);
  }

  getCurrentBattle(): Battle | undefined {
    return this.battles[this.battles.length - 1];
  }

  getCurrentRound() {
    const battle = this.getCurrentBattle();
    if (!battle) {
      return;
    }

    return battle.rounds[battle.rounds.length - 1];
  }

  getItem(itemId: Id) {
    const item = this.items.find((i) => i.id === itemId);

    if (!item) {
      throw new Error("No such item");
    }

    return item;
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
    const defenderWasHit = defender.defense < attackHitRoll;

    const attackEvents = defenderWasHit
      ? attackEffects.flatMap((a) => {
          const status = this.statuses.find((s) => s.id === a.appliesStatusId);
          const defenderDamage = defender.getEffectDamageTaken(a);
          const defenderStatus = defender.getEffectAppliedStatuses(status);

          return [
            defenderStatus && {
              id: generateId("event"),
              characterId: defender.id,
              actionType: ActionType.Attack,
              eventType: CampaignEventType.CharacterStatusGain,
              battleId: currentBattle?.id,
              roundId: currentRound?.id,
              statusId: defenderStatus.id,
            },
            defenderDamage && {
              id: generateId("event"),
              characterId: defender.id,
              actionType: ActionType.Attack,
              eventType: CampaignEventType.CharacterHealthChangeRelative,
              amount: -1 * defenderDamage,
              battleId: currentBattle?.id,
              roundId: currentRound?.id,
            },
          ];
        })
      : [
          {
            id: generateId("event"),
            characterId: defender.id,
            actionType: ActionType.Attack,
            eventType: CampaignEventType.CharacterDodge,
            battleId: currentBattle?.id,
            roundId: currentRound?.id,
          },
        ];

    this.publishCampaignEvent({
      id: generateId("event"),
      characterId: attacker.id,
      actionType: ActionType.Attack,
      eventType: CampaignEventType.CharacterPrimaryAction,
      battleId: currentBattle?.id,
      roundId: currentRound?.id,
    });

    const filtered = attackEvents.filter(
      (e) => e !== undefined
    ) as CampaignEvent[];

    this.publishCampaignEvent(...filtered);
  }

  publishCampaignEvent(...events: CampaignEvent[]) {
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
