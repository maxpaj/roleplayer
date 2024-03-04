import { Id, generateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { Battle, Round } from "../battle/battle";
import {
  Character,
  CharacterClass,
  CharacterResourceType,
  CharacterStat,
  CharacterStatType,
  Clazz,
  LevelExperience,
  isCharacterEvent,
} from "../character/character";
import { Interaction } from "../interaction/interaction";
import { Status } from "../interaction/status";
import {
  EquipmentSlotDefinition as EquipmentSlotDefinition,
  Item,
  ItemEquipmentType,
} from "../item/item";
import { Monster } from "../monster/monster";
import { WorldEvent, WorldEventWithRound } from "./world-events";
import { WorldState } from "./world-state";

type Version = `${string}.${string}.${string}`;

/**
 * Container for all world related things.
 * Holds information about items, spells, statuses, classes, etc. that exists in the world.
 */
export class World {
  id: Id;
  name: string;
  createdUtc: Date;
  libVersion: Version;

  events: WorldEventWithRound[] = [];
  monsters: Monster[] = [];
  items: Item[] = [];
  actions: Interaction[] = [];
  statuses: Status[] = [];
  levelProgression: LevelExperience[] = [0, 50, 100, 200, 400];
  characterStatTypes: CharacterStatType[] = [
    {
      id: generateId(),
      name: "Strength",
    },
    {
      id: generateId(),
      name: "Intelligence",
    },
    {
      id: generateId(),
      name: "Wisdom",
    },
    {
      id: generateId(),
      name: "Charisma",
    },
    {
      id: generateId(),
      name: "Dexterity",
    },
    {
      id: generateId(),
      name: "Constitution",
    },
  ];

  characterResourceTypes: CharacterResourceType[] = [
    {
      id: generateId(),
      name: "Movement Speed",
      defaultMax: 35,
    },
  ];

  characterEquipmentSlots: EquipmentSlotDefinition[] = [
    {
      id: generateId(),
      eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
      name: "Main hand",
    },
  ];

  classes: Clazz[] = [
    {
      id: generateId(),
      levelProgression: [],
      name: "Bard",
    },
  ];

  constructor(c: AugmentedRequired<Partial<World>, "name">) {
    Object.assign(this, c);
    this.id = c.id || generateId();
    this.name = c.name;
    this.createdUtc = c.createdUtc || new Date();
    this.libVersion = c.libVersion || "0.0.1"; // TODO: Should be injected at build time, should throw if the version of the world isn't supported by the lib
    this.events = c.events || [
      {
        type: "RoundStarted",
        id: generateId(),
        roundId: generateId(),
      },
    ];
  }

  getNumberOfRounds() {
    const data = this.applyEvents();
    return data.rounds.length;
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

  setCharacterStats(characterId: Character["id"], stats: CharacterStat[]) {
    const statsEvents: WorldEventWithRound[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: generateId(),
      roundId: this.getCurrentRound().id,
      battleId: this.getCurrentBattle()?.id,
    }));

    this.publishWorldEvent(...statsEvents);
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    const classResetEvent: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterClassReset",
      roundId: this.getCurrentRound().id,
    };

    const classUpdates: WorldEventWithRound[] = classes.map((c) => ({
      characterId,
      id: generateId(),
      type: "CharacterClassLevelGain",
      roundId: this.getCurrentRound().id,
      classId: c.classId,
    }));

    this.events.push(...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(characterId: Character["id"], name: string) {
    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterNameSet",
      name,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  setCharacterBaseDefense(characterId: Character["id"], defense: number) {
    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterBaseDefenseSet",
      defense,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  characterGainExperience(characterId: Character["id"], experience: number) {
    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterExperienceChanged",
      experience,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Character["id"]) {
    const battle = this.getCurrentBattle();
    if (!battle) {
      throw new Error("No current battle ongoing");
    }

    const characterUpdate: WorldEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterEnterBattle",
      battleId: battle.id,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  createCharacter(characterId: Character["id"], name: string) {
    const defaultResourcesEvents: WorldEventWithRound[] =
      this.characterResourceTypes.map((cr) => ({
        type: "CharacterResourceMaxSet",
        max: 10,
        characterId,
        resourceId: cr.id,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      }));

    const defaultStatsEvents: WorldEventWithRound[] =
      this.characterStatTypes.map((st) => ({
        type: "CharacterStatChange",
        amount: 0,
        characterId,
        statId: st.id,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      }));

    const characterSpawnEvents: WorldEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterNameSet",
        name: name,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterExperienceSet",
        experience: 0,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      {
        type: "CharacterBaseDefenseSet",
        defense: 10,
        characterId,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      },
      ...defaultResourcesEvents,
      ...defaultStatsEvents,
    ];

    this.events.push(...characterSpawnEvents);
  }

  nextRound() {
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
      defender.armorClass < diceAttackHitRoll + characterHitModifier;
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
    return this.levelProgression
      .sort((a, b) => a - b)
      .findIndex((l) => l > character.xp);
  }

  applyEvents() {
    const worldState = new WorldState(this, [], [], []);
    this.events.forEach((e) => this.applyEvent(e, worldState));
    return worldState;
  }

  applyEvent(event: WorldEventWithRound, worldState: WorldState) {
    switch (event.type) {
      case "CharacterSpawned":
        worldState.characters.push(
          new Character(this, { id: event.characterId })
        );
        break;

      case "RoundEnded":
        break;

      case "RoundStarted":
        worldState.rounds.push({
          id: event.roundId,
        });
        worldState.characters.forEach((c) => c.resetResources());
        break;

      case "CharacterStatChange":
      case "CharacterExperienceSet":
      case "CharacterBaseDefenseSet":
      case "CharacterNameSet":
      case "CharacterActionGain":
      case "CharacterMaximumHealthSet":
      case "CharacterDespawn":
      case "CharacterStartRound":
      case "CharacterPrimaryAction":
      case "CharacterSecondaryAction":
      case "CharacterMovement":
      case "CharacterEndRound":
      case "CharacterItemGain":
      case "CharacterItemEquip":
      case "CharacterEquipmentSlotGain":
      case "CharacterPositionSet":
      case "CharacterResourceCurrentChange":
      case "CharacterStatusGain":
      case "CharacterAttackAttackerHit":
      case "CharacterAttackAttackerMiss":
      case "CharacterAttackDefenderHit":
      case "CharacterAttackDefenderDodge":
      case "CharacterAttackDefenderParry":
      case "CharacterHealthGain":
      case "CharacterHealthLoss":
      case "CharacterHealthSet":
      case "CharacterClassReset":
      case "CharacterClassLevelGain":
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
        character.resetResources();
        break;
      }

      case "CharacterExperienceChanged": {
        character.xp += event.experience;
        break;
      }

      case "CharacterExperienceSet": {
        character.xp = event.experience;
        break;
      }

      case "CharacterBaseDefenseSet": {
        character.armorClass = event.defense;
        break;
      }

      case "CharacterNameSet": {
        character.name = event.name;
        break;
      }

      case "CharacterStatChange": {
        const stat = character.stats.find((s) => s.statId === event.statId);

        if (!stat) {
          character.stats.push({ statId: event.statId, amount: event.amount });
          break;
        }

        stat.amount = event.amount;
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

      case "CharacterResourceCurrentChange": {
        const resource = character.resourcesCurrent.find(
          (r) => r.resourceId === event.resourceId
        );

        if (!resource) {
          throw new Error("Cannot find resource");
        }

        resource.amount = event.amount;
        break;
      }

      case "CharacterPositionSet": {
        if (!event.targetPosition) {
          throw new Error(
            "Target position not defined for CharacterPositionSet"
          );
        }

        character.position = event.targetPosition;
        break;
      }

      case "CharacterHealthSet": {
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

      case "CharacterMaximumHealthSet": {
        if (event.maximumHealth === undefined) {
          throw new Error(
            "Amount is not defined for CharacterMaximumHealthSet"
          );
        }

        character.maximumHealth = event.maximumHealth || -1;
        break;
      }

      case "CharacterClassReset": {
        character.classes = [];
        break;
      }

      case "CharacterClassLevelGain": {
        const characterClassLevels = character.classes.length;
        const characterLevel = this.getCharacterLevel(character);

        console.log(character);

        if (characterClassLevels >= characterLevel) {
          throw new Error(
            "Cannot add class levels to character, character level not high enough"
          );
        }

        const clazz = this.classes.find((c) => c.id === event.classId);
        if (!clazz) {
          throw new Error("Class not found");
        }

        const characterClass = character.classes.find(
          (c) => c.classId === event.classId
        );

        if (!characterClass) {
          character.classes.push({ classId: event.classId, level: 1 });
          break;
        }

        characterClass.level = characterClass.level + 1;
        break;
      }

      case "CharacterStatusGain": {
        const status = this.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(
            `Could not find status with id ${event.statusId} for CharacterStatusGain`
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
        const resourceType = this.characterResourceTypes.find(
          (r) => r.name === "Movement speed"
        );
        if (!resourceType) {
          throw new Error("Movement resource not defined in world");
        }

        const characterMovementResource = character.resourcesCurrent.find(
          (r) => r.resourceId === resourceType.id
        );

        if (!characterMovementResource) {
          throw new Error(
            "Character does not have a defined movement speed resource"
          );
        }

        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = character.position.x + event.targetPosition.x;
        const distanceY = character.position.y + event.targetPosition.y;
        const distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        if (distance > characterMovementResource.amount) {
          throw new Error(
            "Movement exceeds remaining speed for CharacterMovement"
          );
        }

        characterMovementResource.amount -= distance;
        character.position.x = event.targetPosition.x;
        character.position.y = event.targetPosition.y;
        break;
      }

      case "CharacterActionGain": {
        const action = this.actions.find((a) => a.id === event.actionId);
        if (!action) {
          throw new Error(`Unknown action ${event.actionId}`);
        }
        character.actions.push(action);
        return;
      }

      default:
        console.warn(`Unhandled event ${event.id}, type ${event.type}`);
        throw new Error(`Unhandled event type ${event.type}`);
    }
  }
}
