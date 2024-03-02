import { Id, generateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { Battle, Round } from "../battle/battle";
import {
  ActionResourceType,
  Character,
  CharacterClass,
  LevelExperience,
  Spell,
  isCharacterEvent,
} from "../character/character";
import { Interaction } from "../interaction/interaction";
import { Status } from "../interaction/status";
import {
  EquipmentSlotDefinition as EquipmentSlotDefinition,
  Item,
  ItemEquipmentType,
} from "../item/item";
import { WorldEventType } from "./world-events";
import { WorldState } from "./world-state";

export type { WorldEventType } from "./world-events";

export type WorldEvent = WorldEventType & {
  id: Id;
};

export type WorldEventWithRound = WorldEvent & {
  roundId: Id;
  battleId?: Id;
};

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id: Id;
  name: string;
  createdUtc: Date;

  events: WorldEventWithRound[] = [];
  items: Item[] = [];
  actions: Interaction[] = [];
  spells: Spell[] = [];
  statuses: Status[] = [];
  levelProgression: LevelExperience[] = [0, 50, 100, 200, 400];
  characterEquipmentSlots: EquipmentSlotDefinition[] = [
    {
      id: generateId(),
      eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
      name: "Main hand",
    },
  ];

  constructor(c: AugmentedRequired<Partial<World>, "name">) {
    Object.assign(this, c);
    this.id = c.id || generateId();
    this.name = c.name;
    this.createdUtc = c.createdUtc || new Date();
    this.newRound();
  }

  addCharacterItem(characterId: Character["id"], itemId: Character["id"]) {
    const actionGain: WorldEventWithRound = {
      characterId,
      itemId,
      id: generateId(),
      type: "CharacterItemGain",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(actionGain);
  }

  addCharacterEquipmentSlot(
    characterId: Character["id"],
    equipmentSlotId: EquipmentSlotDefinition["id"]
  ) {
    const equipEvent: WorldEventWithRound = {
      characterId,
      equipmentSlotId,
      id: generateId(),
      type: "CharacterEquipmentSlotGain",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(equipEvent);
  }

  characterEquipItem(characterId: Character["id"], itemId: Item["id"]) {
    const equipEvent: WorldEventWithRound = {
      characterId,
      itemId,
      equipmentSlotId: "",
      id: generateId(),
      type: "CharacterItemEquip",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(equipEvent);
  }

  addActionToCharacter(
    characterId: Character["id"],
    actionId: Interaction["id"]
  ) {
    const actionGain: WorldEventWithRound = {
      characterId,
      actionId,
      id: generateId(),
      type: "CharacterActionGain",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(actionGain);
  }

  getCharacters() {
    const world = this.applyEvents();
    return world.characters;
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    const classUpdates: WorldEventWithRound[] = classes.map((c) => ({
      characterId,
      id: generateId(),
      type: "CharacterClassGain",
      roundId: this.getCurrentRound().id,
      classId: c.clazz.id,
    }));

    this.events.push(...classUpdates);
  }

  setCharacterName(characterId: Character["id"], name: string) {
    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterNameChanged",
      name,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  setCharacterGainExperience(characterId: Character["id"], experience: number) {
    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterExperienceGain",
      experience,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Character["id"]) {
    throw new Error("Not implemented");
  }

  createCharacter(characterId: Character["id"], name: string) {
    const events: WorldEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterNameChanged",
        name: name,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterExperienceChanged",
        experience: 0,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterBaseDefenseChanged",
        defense: 10,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
    ];

    this.events.push(...events);
  }

  newRound() {
    const events: WorldEventWithRound[] = [
      {
        type: "RoundStarted",
        id: generateId(),
        roundId: generateId(),
      },
    ];

    this.events.push(...events);
  }

  endRound() {
    const events: WorldEventWithRound[] = [
      {
        type: "RoundEnded",
        id: generateId(),
        roundId: this.getCurrentRound().id,
      },
    ];

    this.events.push(...events);
  }

  getCharacter(characterId: Id) {
    const character = this.applyEvents().characters.find(
      (c) => c.id === characterId
    );
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

  getCurrentBattleEvents() {
    const battle = this.getCurrentBattle();
    if (!battle) {
      return [];
    }
    return this.getBattleEvents(battle);
  }

  getCurrentBattle(): Battle | undefined {
    const worldData = this.applyEvents();

    return worldData.battles[worldData.battles.length - 1];
  }

  getCurrentRound(): Round {
    const worldData = this.applyEvents();
    const round = worldData.rounds[worldData.rounds.length - 1];
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
    const hitDodgeEvent: WorldEvent = defenderWasHit
      ? {
          id: generateId(),
          characterId: defender.id,
          interactionId: interaction.id,
          attackerId: attacker.id,
          type: "CharacterAttackDefenderHit",
        }
      : {
          id: generateId(),
          characterId: defender.id,
          interactionId: interaction.id,
          attackerId: attacker.id,
          type: "CharacterAttackDefenderDodge",
        };

    const damageTakenEvents: WorldEvent[] = defenderWasHit
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
            } satisfies WorldEvent,
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
            } satisfies WorldEvent;
          })
      : [];

    const attackerPrimaryAction = {
      id: generateId(),
      characterId: attacker.id,
      interactionId: interaction.id,
      type: "CharacterPrimaryAction",
    } satisfies WorldEvent;

    return this.publishWorldEvent(
      ...[
        attackerPrimaryAction,
        hitDodgeEvent,
        ...damageTakenEvents,
        ...statusChangeEvents,
      ]
    );
  }

  publishWorldEvent(...events: WorldEvent[]) {
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
    this.publishWorldEvent({
      type: "CharacterEndRound",
      id: generateId(),
      characterId: character.id,
    });
  }

  getCharacterLevel(character: Character) {
    return this.levelProgression.findIndex((l) => l < character.xp);
  }

  applyEvents() {
    const worldState = new WorldState(this, [], [], []);

    this.events.forEach((e) => this.applyEvent(e, worldState));

    return worldState;
  }

  applyEvent(event: WorldEventWithRound, worldState: WorldState) {
    switch (event.type) {
      case "CharacterSpawned":
        worldState.characters.push(new Character({ id: event.characterId }));
        break;

      case "RoundEnded":
        break;

      case "RoundStarted":
        worldState.rounds.push({
          id: event.roundId,
        });
        break;

      case "CharacterExperienceChanged":
      case "CharacterBaseDefenseChanged":
      case "CharacterNameChanged":
      case "CharacterActionGain":
      case "CharacterMaximumHealthChange":
      case "CharacterDespawn":
      case "CharacterStartRound":
      case "CharacterPrimaryAction":
      case "CharacterSecondaryAction":
      case "CharacterMovement":
      case "CharacterEndRound":
      case "CharacterSpellGain":
      case "CharacterItemGain":
      case "CharacterItemEquip":
      case "CharacterEquipmentSlotGain":
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
          const character = worldState.characters.find(
            (c) => c.id === event.characterId
          );
          if (!character) {
            throw new Error(
              `Character ${event.characterId} not found when processing ${event.type}`
            );
          }

          this.applyCharacterEvent(character, event);
        }
        break;

      default:
        console.warn(`Unknown event type ${event.type}`);
    }
  }

  applyCharacterEvent(character: Character, event: WorldEventWithRound) {
    switch (event.type) {
      case "RoundStarted": {
        character.movementRemaining = character.movementSpeed;
        character.actionResourcesRemaining = [
          ActionResourceType.Primary,
          ActionResourceType.Secondary,
        ];
        break;
      }

      case "CharacterExperienceChanged": {
        character.xp = event.experience;
        break;
      }

      case "CharacterBaseDefenseChanged": {
        character.defense = event.defense;
        break;
      }

      case "CharacterNameChanged": {
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
        if (!event.movementSpeed || event.movementSpeed < 0) {
          throw new Error(
            "Cannot set movespeed to non-positive number for CharacterMoveSpeedChange"
          );
        }

        character.movementSpeed = event.movementSpeed;
        break;
      }

      case "CharacterPositionChange": {
        if (!event.targetPosition) {
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

      case "CharacterAttackAttackerHit": {
        break;
      }

      case "CharacterAttackAttackerMiss": {
        break;
      }

      case "CharacterAttackDefenderHit": {
        break;
      }

      case "CharacterAttackDefenderDodge": {
        const availableReactions = character.reactions.filter(
          (r) => r.eventType === "CharacterAttackDefenderDodge"
        );

        const reactionResources = availableReactions.map((r) => ({
          reactionId: r.id,
          targetId: event.attackerId,
        }));

        character.reactionsRemaining.push(...reactionResources);
        break;
      }

      case "CharacterAttackDefenderParry": {
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
        if (!character.currentHealth && character.currentHealth !== 0) {
          throw new Error("Character health unknown");
        }

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
        if (!spell) {
          throw new Error(
            `Could not find spell with id ${event.spellId} for CharacterGainSpell`
          );
        }

        character.spells.push(spell);
        break;
      }

      case "CharacterStatusGain": {
        const status = this.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(
            `Could not find status with id ${event.statusId} for CharacterGainSpell`
          );
        }

        character.statuses.push(status);
        break;
      }

      case "CharacterItemGain": {
        const item = this.items.find((eq) => eq.id === event.itemId);
        if (!item) {
          throw new Error(
            `Could not find item with id ${event.itemId} for CharacterGainItem`
          );
        }

        character.inventory.push(item);
        break;
      }

      case "CharacterEquipmentSlotGain": {
        const characterSlot = this.characterEquipmentSlots.find(
          (slot) => slot.id === event.equipmentSlotId
        );

        if (!characterSlot) {
          throw new Error("Cannot find slot");
        }

        const existing = character.equipment.find(
          (eq) => eq.slotId === event.equipmentSlotId
        );

        if (existing) {
          throw new Error("Character already have equipment slot");
        }

        character.equipment.push({ slotId: characterSlot.id, item: undefined });

        break;
      }

      case "CharacterItemEquip": {
        const item = this.items.find((eq) => eq.id === event.itemId);
        if (!item) {
          throw new Error(`Could not find item on world`);
        }

        const characterHasItem = character.inventory.find(
          (eq) => eq.id === event.itemId
        );
        if (!characterHasItem) {
          throw new Error(`Could not find item on character`);
        }

        const slot = character.equipment.find(
          (e) => e.slotId === event.equipmentSlotId
        );
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = item;

        break;
      }

      case "CharacterMovement": {
        if (character.movementSpeed === undefined) {
          throw new Error("Character does not have a defined movement speed");
        }

        if (!event.targetPosition) {
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

      case "CharacterActionGain": {
        const action = this.actions.find((a) => a.id === event.actionId);
        if (!action) {
          throw new Error(`Unknown action ${event.actionId}`);
        }
        character.baseActions.push(action);
        return;
      }

      default:
        console.warn(`Unhandled event ${event.id}, type ${event.type}`);
        break;
    }
  }
}
