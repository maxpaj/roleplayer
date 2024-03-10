import {
  Battle,
  Character,
  CharacterStat,
  Id,
  Interaction,
  Item,
  Round,
  World,
  CampaignEvent,
  CampaignEventWithRound,
  generateId,
  Monster,
  BattleEntity,
} from "../..";
import { AugmentedRequired } from "../../types/with-required";
import { CharacterClass, isCharacterEvent } from "../character/character";
import { EquipmentSlotDefinition } from "../item/item";
import { CampaignState } from "./campaign-state";

export class Campaign {
  id!: Id;
  name!: string;
  world?: World;
  worldId!: World["id"];
  adventurers!: Character[];
  events: CampaignEventWithRound[] = [];

  constructor(c: AugmentedRequired<Partial<Campaign>, "name">) {
    Object.assign(this, c);

    this.events = c.events || [
      {
        type: "RoundStarted",
        id: generateId(),
        roundId: generateId(),
      },
    ];
  }

  addCharacterItem(characterId: Character["id"], itemId: Character["id"]) {
    const actionGain: CampaignEventWithRound = {
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
    const equipEvent: CampaignEventWithRound = {
      characterId,
      equipmentSlotId,
      id: generateId(),
      type: "CharacterEquipmentSlotGain",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(equipEvent);
  }

  characterEquipItem(characterId: Character["id"], itemId: Item["id"]) {
    const equipEvent: CampaignEventWithRound = {
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
    const actionGain: CampaignEventWithRound = {
      characterId,
      actionId,
      id: generateId(),
      type: "CharacterActionGain",
      roundId: this.getCurrentRound().id,
    };

    this.events.push(actionGain);
  }

  getNumberOfRounds() {
    const data = this.applyEvents();
    return data.rounds.length;
  }

  getCharacters() {
    const world = this.applyEvents();
    return world.characters;
  }

  setCharacterStats(characterId: Character["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEventWithRound[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: generateId(),
      roundId: this.getCurrentRound().id,
      battleId: this.getCurrentBattle()?.id,
    }));

    this.publishCampaignEvent(...statsEvents);
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    const classResetEvent: CampaignEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterClassReset",
      roundId: this.getCurrentRound().id,
    };

    const classUpdates: CampaignEventWithRound[] = classes.map((c) => ({
      characterId,
      id: generateId(),
      type: "CharacterClassLevelGain",
      roundId: this.getCurrentRound().id,
      classId: c.classId,
    }));

    this.events.push(...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(characterId: Character["id"], name: string) {
    const characterUpdate: CampaignEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterNameSet",
      name,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  setCharacterBaseDefense(characterId: Character["id"], defense: number) {
    const characterUpdate: CampaignEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterBaseDefenseSet",
      defense,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  characterGainExperience(characterId: Character["id"], experience: number) {
    const characterUpdate: CampaignEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterExperienceChanged",
      experience,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  addMonsterToCurrentBattle(monsterId: Monster["id"]) {
    const battle = this.getCurrentBattle();
    if (!battle) {
      throw new Error("No current battle ongoing");
    }

    const monsterUpdate: CampaignEventWithRound = {
      monsterId,
      id: generateId(),
      type: "MonsterEnterBattle",
      battleId: battle.id,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(monsterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Character["id"]) {
    const battle = this.getCurrentBattle();
    if (!battle) {
      throw new Error("No current battle ongoing");
    }

    const characterUpdate: CampaignEventWithRound = {
      characterId,
      id: generateId(),
      type: "CharacterEnterBattle",
      battleId: battle.id,
      roundId: this.getCurrentRound().id,
    };

    this.events.push(characterUpdate);
  }

  createCharacter(characterId: Character["id"], name: string) {
    const defaultResourcesEvents: CampaignEventWithRound[] =
      this.world!.characterResourceTypes.map((cr) => ({
        type: "CharacterResourceMaxSet",
        max: 10,
        characterId,
        resourceId: cr.id,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      }));

    const defaultStatsEvents: CampaignEventWithRound[] =
      this.world!.characterStatTypes.map((st) => ({
        type: "CharacterStatChange",
        amount: 0,
        characterId,
        statId: st.id,
        id: generateId(),
        roundId: this.getCurrentRound().id,
        battleId: this.getCurrentBattle()?.id,
      }));

    const characterSpawnEvents: CampaignEventWithRound[] = [
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

  nextRound(battleId?: Battle["id"]) {
    const events: CampaignEventWithRound[] = [
      {
        type: "RoundStarted",
        id: generateId(),
        roundId: generateId(),
        battleId,
      },
    ];

    this.events.push(...events);
  }

  endRound() {
    const events: CampaignEventWithRound[] = [
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

  startBattle() {
    const battleId = generateId();

    this.events.push({
      id: generateId(),
      type: "BattleStarted",
      battleId,
      roundId: generateId(),
    });

    return battleId;
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
    const item = this.world!.items.find((i) => i.id === itemId);

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
    const hitDodgeEvent: CampaignEvent = defenderWasHit
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
            const status = this.world!.statuses.find(
              (s) => s.id === attack.appliesStatusId
            );
            return status !== undefined;
          })
          .flatMap((attack) => {
            const defenderStatus = defender.getEffectAppliedStatuses(
              this.world!.statuses.find((s) => s.id === attack.appliesStatusId)
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

  endCharacterTurn(entity: BattleEntity) {
    this.publishCampaignEvent({
      type: "CharacterEndRound",
      id: generateId(),
      characterId: entity.actor.id,
    });
  }

  getCharacterLevel(character: Character) {
    return this.world!.levelProgression.sort((a, b) => a - b).findIndex(
      (l) => l > character.xp
    );
  }

  applyEvents() {
    const worldState = new CampaignState(this, [], [], []);
    this.events.forEach((e) => this.applyEvent(e, worldState));
    return worldState;
  }

  applyEvent(event: CampaignEventWithRound, campaignState: CampaignState) {
    switch (event.type) {
      case "CharacterSpawned":
        campaignState.characters.push(
          new Character(this.world!, { id: event.characterId })
        );
        break;

      case "RoundEnded":
        break;

      case "MonsterEnterBattle": {
        const battle = campaignState.battles.find(
          (b) => b.id === event.battleId
        );
        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const monsterDefinition = this.world?.monsters.find(
          (m) => m.id === event.monsterId
        );

        battle.addEntity(
          new Monster(this.world!, {
            id: generateId(),
            definition: monsterDefinition,
          })
        );
        break;
      }

      case "RoundStarted":
        campaignState.rounds.push({
          id: event.roundId,
        });
        campaignState.characters.forEach((c) => c.resetResources());
        break;

      case "BattleStarted": {
        campaignState.battles.push(
          new Battle({
            id: event.battleId,
            name: "Battle",
          })
        );

        break;
      }

      case "CharacterEnterBattle":
      case "CharacterStatChange":
      case "CharacterExperienceSet":
      case "CharacterResourceMaxSet":
      case "CharacterExperienceChanged":
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
          const character = campaignState.characters.find(
            (c) => c.id === event.characterId
          );
          if (!character) {
            throw new Error(
              `Character ${event.characterId} not found when processing ${event.type}`
            );
          }

          this.applyCharacterEvent(character, campaignState, event);
        }
        break;

      default:
        console.warn(`Unknown event type ${event.type}`);
    }
  }

  applyCharacterEvent(
    character: Character,
    campaignState: CampaignState,
    event: CampaignEventWithRound
  ) {
    switch (event.type) {
      case "RoundStarted": {
        character.resetResources();
        break;
      }

      case "CharacterEnterBattle": {
        const battle = campaignState.battles.find(
          (b) => b.id === event.battleId
        );
        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const character = campaignState.characters.find(
          (m) => m.id === event.characterId
        );

        if (!character) {
          throw new Error("Cannot find character");
        }

        battle.addEntity(character);

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

      case "CharacterResourceMaxSet": {
        const resource = character.resourcesMax.find(
          (r) => r.resourceId === event.resourceId
        );

        if (!resource) {
          throw new Error("Cannot find max resource");
        }

        resource.amount = event.max;
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

        if (characterClassLevels >= characterLevel) {
          throw new Error(
            "Cannot add class levels to character, character level not high enough"
          );
        }

        const clazz = this.world!.classes.find((c) => c.id === event.classId);
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
        const status = this.world!.statuses.find(
          (s) => s.id === event.statusId
        );
        if (!status) {
          throw new Error(
            `Could not find status with id ${event.statusId} for CharacterStatusGain`
          );
        }

        character.statuses.push(status);
        break;
      }

      case "CharacterItemGain": {
        const item = this.world!.items.find((eq) => eq.id === event.itemId);
        if (!item) {
          throw new Error(
            `Could not find item with id ${event.itemId} for CharacterGainItem`
          );
        }

        character.inventory.push(item);
        break;
      }

      case "CharacterEquipmentSlotGain": {
        const characterSlot = this.world!.characterEquipmentSlots.find(
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
        const item = this.world!.items.find((eq) => eq.id === event.itemId);
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
        const resourceType = this.world!.characterResourceTypes.find(
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
        const action = this.world!.actions.find((a) => a.id === event.actionId);
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