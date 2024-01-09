import { Id, generateId } from "../../id";
import { Battle, Round } from "../battle/battle";
import { Character, Spell } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Interaction } from "../interaction/interaction";
import { Status } from "../interaction/status";
import { Item } from "../item/item";

export type CampaignEventType =
  | { type: "Unknown" }
  | { type: "NewRound" }
  | { type: "CharacterSpawned"; characterId: Id }
  | { type: "CharacterDespawn"; characterId: Id }
  | { type: "CharacterStartRound"; characterId: Id }
  | { type: "CharacterPrimaryAction"; characterId: Id; interactionId: Id }
  | { type: "CharacterSecondaryAction"; characterId: Id }
  | { type: "CharacterMovement"; characterId: Id; targetPosition: Position }
  | { type: "CharacterEndRound"; characterId: Id }
  | { type: "CharacterSpellGain"; characterId: Id; spellId: Id }
  | { type: "CharacterItemGain"; characterId: Id; itemId: Id }
  | { type: "CharacterPermanentHealthChange"; characterId: Id; amount: number }
  | {
      type: "CharacterPositionChange";
      characterId: Id;
      targetPosition: Position;
    }
  | { type: "CharacterMoveSpeedChange"; characterId: Id; amount: number }
  | {
      type: "CharacterStatusGain";
      characterId: Id;
      interactionId: Id;
      statusId: Id;
    }
  | { type: "CharacterAttackAttackerHit"; characterId: Id }
  | { type: "CharacterAttackAttackerMiss"; characterId: Id }
  | { type: "CharacterAttackDefenderHit"; characterId: Id; interactionId: Id }
  | { type: "CharacterAttackDefenderDodge"; characterId: Id; interactionId: Id }
  | { type: "CharacterAttackDefenderParry"; characterId: Id }
  | {
      type: "CharacterHealthGain";
      characterId: Id;
      interactionId: Id;
      amount: number;
    }
  | {
      type: "CharacterHealthLoss";
      characterId: Id;
      interactionId: Id;
      amount: number;
    }
  | { type: "CharacterHealthChange"; characterId: Id; amount: number }
  | { type: "CharacterClassGain"; characterId: Id; classId: Id };

export type CampaignEvent = CampaignEventType & {
  id: Id;
};

export type CampaignEventWithRound = CampaignEvent & {
  roundId: Id;
  battleId?: Id;
};

export type Position = {
  x: number;
  y: number;
  z: number;
};

export function isCharacterEvent(
  event: CampaignEvent
): event is Extract<CampaignEvent, { characterId: Id }> {
  return (event as any).characterId !== undefined;
}

export class Campaign {
  items: Item[];
  characters: Character[];
  battles: Battle[];
  events: CampaignEventWithRound[];
  spells: Spell[];
  rounds: Round[];
  statuses: Status[];

  constructor(
    items: Item[] = [],
    characters: Character[] = [],
    battles: Battle[] = [],
    events: CampaignEventWithRound[] = [],

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
    const characterEvents = this.events.filter((event) => {
      return (
        (isCharacterEvent(event) && event.characterId === characterId) ||
        event.type === "NewRound"
      );
    });

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

  allCharactersHaveActed(events: CampaignEventWithRound[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some(
        (e) =>
          e.type === "CharacterEndRound" &&
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

  getCurrentRound(): Round {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("No current round");
    }

    return round;
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
    diceAttackHitRoll: number,
    interaction: Interaction,
    defender: Character
  ) {
    const characterHitModifier =
      attacker.getCharacterHitModifierWithInteraction(interaction);
    const defenderWasHit =
      defender.defense < diceAttackHitRoll + characterHitModifier;
    const hitDodgeEvent: CampaignEvent = defenderWasHit
      ? {
          id: generateId("event"),
          characterId: defender.id,
          interactionId: interaction.id,
          type: "CharacterAttackDefenderHit",
        }
      : {
          id: generateId("event"),
          characterId: defender.id,
          interactionId: interaction.id,
          type: "CharacterAttackDefenderDodge",
        };

    const damageTakenEvents: CampaignEvent[] = defenderWasHit
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
              interactionId: interaction.id,
              type: "CharacterHealthLoss",
              amount: defenderDamageTaken,
            } satisfies CampaignEvent,
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
              type: "CharacterStatusGain",
              statusId: defenderStatus!.id,
            } satisfies CampaignEvent;
          })
      : [];

    const attackerPrimaryAction = {
      id: generateId("event"),
      characterId: attacker.id,
      interactionId: interaction.id,
      type: "CharacterPrimaryAction",
    } satisfies CampaignEvent;

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
    const eventsWithRoundAndBattle = events.map((e) => {
      return {
        ...e,
        battleId: currentBattle?.id,
        roundId: currentRound.id,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return events;
  }

  logEvent(e: CampaignEvent) {}

  getCharacterRoundEvents(round: Round, characterId: Id) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter(
      (re) => isCharacterEvent(re) && re.characterId === characterId
    );
  }

  endCharacterTurn(character: Character) {
    this.publishCampaignEvent({
      type: "CharacterEndRound",
      id: generateId("event"),
      characterId: character.id,
    });
  }

  characterHasRoundEvent(
    round: Round,
    characterId: Id,
    type: CampaignEventType["type"]
  ) {
    const roundCharacterEvents = this.getCharacterRoundEvents(
      round,
      characterId
    );

    return roundCharacterEvents.some(
      (event) =>
        isCharacterEvent(event) &&
        event.characterId === characterId &&
        event.type === type
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

    this.publishCampaignEvent(
      {
        id: generateId("event"),
        characterId: random.id,
        type: "CharacterSpawned",
      },
      ...random.classes.map(
        ({ clazz }) =>
          ({
            id: generateId("event"),
            characterId: random.id,
            type: "CharacterClassGain",
            classId: clazz.name,
          }) satisfies CampaignEvent
      )
    );

    return random;
  }
}
