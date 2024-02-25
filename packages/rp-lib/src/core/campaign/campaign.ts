import { Id, generateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/withRequired";
import { Battle, Round } from "../battle/battle";
import { ActionResourceType, Character, Spell } from "../character/character";
import { randomCharacter } from "../character/random-char";
import { Interaction } from "../interaction/interaction";
import { Status } from "../interaction/status";
import { Item } from "../item/item";

export type CampaignEventType =
  | { type: "Unknown" }
  | { type: "RoundStarted" }
  | { type: "BattleStarted" }
  | { type: "CharacterSpawned"; characterId: Id }
  | { type: "CharacterChangedName"; characterId: Id; name: string }
  | { type: "CharacterDespawn"; characterId: Id }
  | { type: "CharacterStartRound"; characterId: Id }
  | { type: "CharacterPrimaryAction"; characterId: Id; interactionId: Id }
  | { type: "CharacterSecondaryAction"; characterId: Id }
  | { type: "CharacterMovement"; characterId: Id; targetPosition: Position }
  | { type: "CharacterEndRound"; characterId: Id }
  | { type: "CharacterSpellGain"; characterId: Id; spellId: Id }
  | { type: "CharacterItemGain"; characterId: Id; itemId: Id }
  | {
      type: "CharacterMaximumHealthChange";
      characterId: Id;
      maximumHealth: number;
    }
  | {
      type: "CharacterPositionChange";
      characterId: Id;
      targetPosition: Position;
    }
  | { type: "CharacterMoveSpeedChange"; characterId: Id; movementSpeed: number }
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
      healthGain: number;
    }
  | {
      type: "CharacterHealthLoss";
      characterId: Id;
      interactionId: Id;
      healthLoss: number;
    }
  | { type: "CharacterHealthChange"; characterId: Id; healthChange: number }
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
): event is Extract<CampaignEvent, { characterId: Character["id"] }> {
  return (event as any).characterId !== undefined;
}

type LevelExperience = number;

export class Campaign {
  id: Id;
  name: string;
  createdUtc: Date;

  items: Item[] = [];
  characters: Character[] = [];
  battles: Battle[] = [];
  events: CampaignEventWithRound[] = [];
  spells: Spell[] = [];
  rounds: Round[] = [
    {
      id: generateId(),
    },
  ];
  statuses: Status[] = [];
  levelProgression: LevelExperience[] = [0, 50, 100, 200, 400];

  constructor(c: AugmentedRequired<Partial<Campaign>, "name">) {
    Object.assign(this, c);
    this.id = c.id || generateId();
    this.name = c.name;
    this.createdUtc = c.createdUtc || new Date();
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
          id: generateId(),
          characterId: defender.id,
          interactionId: interaction.id,
          type: "CharacterAttackDefenderHit",
        }
      : {
          id: generateId(),
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
              id: generateId(),
              characterId: defender.id,
              interactionId: interaction.id,
              type: "CharacterHealthLoss",
              healthLoss: defenderDamageTaken,
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
              id: generateId(),
              characterId: defender.id,
              interactionId: interaction.id,
              type: "CharacterStatusGain",
              statusId: defenderStatus!.id,
            } satisfies CampaignEvent;
          })
      : [];

    const attackerPrimaryAction = {
      id: generateId(),
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

  getCharacterRoundEvents(round: Round, characterId: Id) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter(
      (re) => isCharacterEvent(re) && re.characterId === characterId
    );
  }

  endCharacterTurn(character: Character) {
    this.publishCampaignEvent({
      type: "CharacterEndRound",
      id: generateId(),
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
    const random = randomCharacter(generateId());
    random.isPlayerControlled = isPlayerControlled;
    random.name = name;

    this.characters.push(random);

    this.publishCampaignEvent(
      {
        id: generateId(),
        characterId: random.id,
        type: "CharacterSpawned",
      },
      ...random.classes.map(
        ({ clazz }) =>
          ({
            id: generateId(),
            characterId: random.id,
            type: "CharacterClassGain",
            classId: clazz.name,
          }) satisfies CampaignEvent
      )
    );

    return random;
  }

  getCharacterLevel(character: Character) {
    return this.levelProgression.findIndex((l) => l < character.xp);
  }

  applyEvents() {
    this.events.forEach(this.applyEvent, this);
  }

  applyEvent(event: CampaignEventWithRound) {
    switch (event.type) {
      case "CharacterSpawned":
        this.characters.push(new Character({ id: event.characterId }));
        break;

      case "CharacterChangedName":
      case "CharacterMaximumHealthChange":
      case "CharacterDespawn":
      case "CharacterStartRound":
      case "CharacterPrimaryAction":
      case "CharacterSecondaryAction":
      case "CharacterMovement":
      case "CharacterEndRound":
      case "CharacterSpellGain":
      case "CharacterItemGain":
      case "CharacterPositionChange":
      case "CharacterMoveSpeedChange":
      case "CharacterStatusGain":
      case "CharacterAttackAttackerHit":
      case "CharacterAttackAttackerMiss":
      case "CharacterAttackDefenderHit":
      case "CharacterAttackDefenderDodge":
      case "CharacterAttackDefenderParry":
      case "CharacterHealthGain":
      case "CharacterHealthLoss":
      case "CharacterHealthChange":
      case "CharacterClassGain":
        {
          const character = this.characters.find(
            (c) => c.id === event.characterId
          );
          if (!character) {
            throw new Error("No such character");
          }

          this.applyCharacterEvent(character, event);
        }
        break;

      default:
        console.warn(`Unknown event type ${event.type}`);
    }
  }

  applyCharacterEvent(character: Character, event: CampaignEventWithRound) {
    switch (event.type) {
      case "RoundStarted": {
        character.movementRemaining = character.movementSpeed;
        character.actionResourcesRemaining = [
          ActionResourceType.Primary,
          ActionResourceType.Secondary,
        ];
        break;
      }

      case "CharacterChangedName": {
        character.name = event.name;
        break;
      }

      case "CharacterPrimaryAction": {
        break;
      }

      case "CharacterSecondaryAction": {
        break;
      }

      case "CharacterSpawned": {
        character.exists = true;
        break;
      }

      case "CharacterDespawn": {
        character.exists = false;
        break;
      }

      case "CharacterMoveSpeedChange": {
        if (event.movementSpeed === undefined || event.movementSpeed < 0) {
          throw new Error(
            "Cannot set movespeed to non-positive number for CharacterMoveSpeedChange"
          );
        }

        character.movementSpeed = event.movementSpeed;
        break;
      }

      case "CharacterPositionChange": {
        if (event.targetPosition === undefined) {
          throw new Error(
            "Target position not defined for CharacterPositionChange"
          );
        }

        character.position = event.targetPosition;
        break;
      }

      case "CharacterHealthChange": {
        if (event.healthChange === undefined || event.healthChange < 0) {
          throw new Error("Amount is not defined for CharacterHealthGain");
        }

        character.currentHealth = event.healthChange;
        break;
      }

      case "CharacterHealthGain": {
        if (event.healthGain === undefined || event.healthGain < 0) {
          throw new Error("Amount is not defined for CharacterHealthGain");
        }

        character.currentHealth += event.healthGain;
        break;
      }

      case "CharacterHealthLoss": {
        if (event.healthLoss === undefined || event.healthLoss < 0) {
          throw new Error("Amount is not defined for CharacterHealthLoss");
        }

        character.currentHealth -= event.healthLoss;
        break;
      }

      case "CharacterMaximumHealthChange": {
        if (event.maximumHealth === undefined) {
          throw new Error(
            "Amount is not defined for CharacterMaximumHealthChange"
          );
        }

        character.maximumHealth = event.maximumHealth || -1;
        break;
      }

      case "CharacterSpellGain": {
        const spell = this.spells.find((s) => s.id === event.spellId);
        if (spell === undefined) {
          throw new Error(
            `Could not find spell with id ${event.spellId} for CharacterGainSpell`
          );
        }

        character.spells.push(spell);
        break;
      }

      case "CharacterStatusGain": {
        const status = this.statuses.find((s) => s.id === event.statusId);
        if (status === undefined) {
          throw new Error(
            `Could not find status with id ${event.statusId} for CharacterGainSpell`
          );
        }

        character.statuses.push(status);
        break;
      }

      case "CharacterItemGain": {
        const item = this.items.find((eq) => eq.id === event.itemId);
        if (item === undefined) {
          throw new Error(
            `Could not find item with id ${event.itemId} for CharacterGainItem`
          );
        }

        character.inventory.push(item);
        break;
      }

      case "CharacterMovement": {
        if (character.movementSpeed === undefined) {
          throw new Error("Character does not have a defined movement speed");
        }

        if (event.targetPosition === undefined) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = character.position.x + event.targetPosition.x;
        const distanceY = character.position.y + event.targetPosition.y;
        const distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        if (distance > character.movementRemaining) {
          throw new Error(
            "Movement exceeds remaining speed for CharacterMovement"
          );
        }

        character.movementRemaining -= distance;
        character.position.x = event.targetPosition.x;
        character.position.y = event.targetPosition.y;
        break;
      }

      default:
        console.warn(`Unhandled event ${event.id}, type ${event.type}`);
        break;
    }
  }
}
