import { Battle, Round } from "../battle/battle";
import { ActionType, Spell } from "../character/character";
import { Character } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Id, generateId } from "../../id";
import { Item } from "../item/item";
import { Status } from "../interaction/status";
import { Interaction } from "../interaction/interaction";

export enum CampaignEventType {
  Unknown = "Unknown",
  NewRound = "NewRound",
  CharacterSpawned = "CharacterSpawned",
  CharacterDespawn = "CharacterDespawn",
  CharacterStartRound = "CharacterStartRound",
  CharacterPrimaryAction = "CharacterPrimaryAction",
  CharacterSecondaryAction = "CharacterSecondaryAction",
  CharacterMovement = "CharacterMovement",
  CharacterEndRound = "CharacterEndRound",
  CharacterSpellGain = "CharacterSpellGain",
  CharacterItemGain = "CharacterItemGain",
  CharacterPermanentHealthChange = "CharacterPermanentHealthChange",
  CharacterPositionChange = "CharacterPositionChange",
  CharacterMoveSpeedChange = "CharacterMoveSpeedChange",
  CharacterStatusGain = "CharacterStatusGain",
  CharacterAttackAttackerHit = "CharacterAttackAttackerHit",
  CharacterAttackAttackerMiss = "CharacterAttackAttackerMiss",
  CharacterAttackDefenderHit = "CharacterAttackDefenderHit",
  CharacterAttackDefenderDodge = "CharacterAttackDefenderDodge",
  CharacterAttackDefenderParry = "CharacterAttackDefenderParry",
  CharacterHealthGain = "CharacterHealthGain",
  CharacterHealthLoss = "CharacterHealthLoss",
  CharacterHealthChange = "CharacterHealthChange",
}

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type CampaignEvent = {
  id: Id;
  eventType: CampaignEventType;
  actionType: ActionType;

  amount?: number;
  targetPosition?: Position;
  interactionId?: Id;

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
      (c) => c.characterId === characterId || c.characterId === "system"
    );

    const character = new Character();
    characterEvents.forEach((event) => {
      character.applyEvent(event, this);
    }, character);

    return character;
  }

  getRoundEvents(round: Round) {
    return this.events.filter((e) => e.roundId === round.id);
  }

  getBattleEvents(battle: Battle) {
    return this.events.filter((e) => e.battleId === battle.id);
  }

  allCharactersHaveActed(events: CampaignEvent[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some(
        (e) =>
          e.eventType === CampaignEventType.CharacterEndRound &&
          e.characterId === c.id &&
          e.roundId === round.id
      )
    );
  }

  getCurrentBattleEvents() {
    const battle = this.getCurrentBattle();
    if (battle === undefined) {
      return [];
    }
    return this.getBattleEvents(battle);
  }

  getCurrentBattle(): Battle | undefined {
    return this.battles[this.battles.length - 1];
  }

  getCurrentRound(): Round | undefined {
    return this.rounds[this.rounds.length - 1];
  }

  getItem(itemId: Id) {
    const item = this.items.find((i) => i.id === itemId);

    if (!item) {
      throw new Error("No such item");
    }

    return item;
  }

  performCharacterAttack(
    attacker: Character,
    attackHitRoll: number,
    interaction: Interaction,
    defender: Character
  ) {
    const defenderWasHit = defender.defense < attackHitRoll;
    const hitDodgeEvent = defenderWasHit
      ? {
          id: generateId("event"),
          characterId: defender.id,
          interactionId: interaction.id,
          actionType: ActionType.Attack,
          eventType: CampaignEventType.CharacterAttackDefenderHit,
        }
      : {
          id: generateId("event"),
          characterId: defender.id,
          interactionId: interaction.id,
          actionType: ActionType.Dodge,
          eventType: CampaignEventType.CharacterAttackDefenderDodge,
        };

    const damageTakenEvents = defenderWasHit
      ? interaction.appliesEffects.flatMap((attack) => {
          const attackerDamageRoll = attacker.getDamageRoll(attack);
          const defenderDamageTaken = defender.getEffectDamageTaken(
            attack,
            attackerDamageRoll
          );

          return [
            {
              id: generateId("event"),
              characterId: defender.id,
              actionType: ActionType.Attack,
              interactionId: interaction.id,
              eventType: CampaignEventType.CharacterHealthLoss,
              amount: defenderDamageTaken,
            },
          ];
        })
      : [];

    const statusChangeEvents = defenderWasHit
      ? interaction.appliesEffects
          .filter((attack) => {
            const status = this.statuses.find(
              (s) => s.id === attack.appliesStatusId
            );
            return status !== undefined;
          })
          .flatMap((attack) => {
            const defenderStatus = defender.getEffectAppliedStatuses(
              this.statuses.find((s) => s.id === attack.appliesStatusId)
            );

            return {
              id: generateId("event"),
              characterId: defender.id,
              interactionId: interaction.id,
              actionType: ActionType.Attack,
              eventType: CampaignEventType.CharacterStatusGain,
              statusId: defenderStatus!.id,
            };
          })
      : [];

    const attackerPrimaryAction = {
      id: generateId("event"),
      characterId: attacker.id,
      actionType: ActionType.Attack,
      interactionId: interaction.id,
      eventType: CampaignEventType.CharacterPrimaryAction,
    };

    return this.publishCampaignEvent(
      ...[
        attackerPrimaryAction,
        hitDodgeEvent,
        ...damageTakenEvents,
        ...statusChangeEvents,
      ]
    );
  }

  publishCampaignEvent(...events: CampaignEvent[]) {
    const currentBattle = this.getCurrentBattle();
    const currentRound = this.getCurrentRound();

    this.events.push(
      ...events.map((e) => {
        return {
          ...e,
          roundId: currentRound?.id,
          battleId: currentBattle?.id,
        };
      })
    );
    return events;
  }

  logEvent(e: CampaignEvent) {}

  getCharacterRoundEvents(round: Round, characterId: Id) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => re.characterId === characterId);
  }

  endCharacterTurn(character: Character) {
    this.publishCampaignEvent({
      eventType: CampaignEventType.CharacterEndRound,
      id: generateId("event"),
      actionType: ActionType.None,
      characterId: character.id,
    });
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
