import { Id, dangerousGenerateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { Actor } from "../actor/actor";
import { Character, CharacterClass, CharacterStat, isCharacterEvent } from "../actor/character";
import { Monster, MonsterInstance } from "../actor/monster";
import { Battle } from "../battle/battle";
import { Interaction } from "../world/interaction/interaction";
import { EquipmentSlotDefinition, Item } from "../world/item/item";
import { World } from "../world/world";
import { CampaignEvent, CampaignEventWithRound } from "./campaign-events";
import { CampaignState } from "./campaign-state";
import { Round } from "./round";

export class Campaign {
  id: Id;
  name: string;
  world: World;
  events: CampaignEventWithRound[] = [];

  constructor(c: AugmentedRequired<Partial<Campaign>, "id" | "name" | "world">) {
    Object.assign(this, c);

    this.id = c.id;
    this.name = c.name;
    this.world = c.world;

    this.events = c.events || [
      {
        id: dangerousGenerateId(),
        type: "CampaignStarted",
        roundId: "00000000-0000-0000-0000-000000000000",
        serialNumber: 0,
      },
      {
        type: "RoundStarted",
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 1,
      },
    ];
  }

  addCharacterItem(characterId: Character["id"], itemId: Character["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      itemId,
      id: dangerousGenerateId(),
      type: "CharacterItemGain",
    };

    this.publishCampaignEvent(actionGain);
  }

  addCharacterEquipmentSlot(characterId: Character["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterEquipmentSlotGain",
    };

    this.publishCampaignEvent(equipEvent);
  }

  characterEquipItem(characterId: Character["id"], itemId: Item["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
    const equipEvent: CampaignEvent = {
      characterId,
      itemId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterItemEquip",
    };

    this.publishCampaignEvent(equipEvent);
  }

  addActionToCharacter(characterId: Character["id"], actionId: Interaction["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      actionId,
      id: dangerousGenerateId(),
      type: "CharacterActionGain",
    };

    this.publishCampaignEvent(actionGain);
  }

  setCharacterStats(characterId: Character["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: dangerousGenerateId(),
    }));

    this.publishCampaignEvent(...statsEvents);
  }

  setCharacterClasses(characterId: Character["id"], classes: CharacterClass[]) {
    const classResetEvent: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterClassReset",
    };

    const classUpdates: CampaignEvent[] = classes.map((c) => ({
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterClassLevelGain",
      classId: c.classId,
    }));

    this.publishCampaignEvent(...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(characterId: Character["id"], name: string) {
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterNameSet",
      name,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  setCharacterBaseDefense(characterId: Character["id"], defense: number) {
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterBaseDefenseSet",
      defense,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  characterGainExperience(characterId: Character["id"], experience: number) {
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterExperienceChanged",
      experience,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  addMonsterToCurrentBattle(monsterId: Monster["id"]) {
    const monsterUpdate: CampaignEvent = {
      monsterId,
      id: dangerousGenerateId(),
      type: "MonsterBattleEnter",
    };

    this.publishCampaignEvent(monsterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Character["id"], initiativeRoll: number) {
    const characterBattleEnter: CampaignEvent[] = [
      {
        characterId,
        id: dangerousGenerateId(),
        type: "CharacterBattleEnter",
      },
      {
        characterId,
        id: dangerousGenerateId(),
        type: "CharacterBattleInitiativeSet",
        initiative: initiativeRoll,
      },
    ];

    this.publishCampaignEvent(...characterBattleEnter);
  }

  createCharacter(characterId: Character["id"], name: string) {
    const defaultResourcesEvents: CampaignEvent[] = this.world!.ruleset.characterResourceTypes.map((cr) => ({
      type: "CharacterResourceMaxSet",
      max: 10,
      characterId,
      resourceTypeId: cr.id,
      id: dangerousGenerateId(),
    }));

    const defaultStatsEvents: CampaignEvent[] = this.world!.ruleset.characterStatTypes.map((st) => ({
      type: "CharacterStatChange",
      amount: 0,
      characterId,
      statId: st.id,
      id: dangerousGenerateId(),
    }));

    const characterSpawnEvents: CampaignEvent[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: dangerousGenerateId(),
      },
      {
        type: "CharacterNameSet",
        name: name,
        characterId,
        id: dangerousGenerateId(),
      },
      {
        type: "CharacterExperienceSet",
        experience: 0,
        characterId,
        id: dangerousGenerateId(),
      },
      {
        type: "CharacterBaseDefenseSet",
        defense: 10,
        characterId,
        id: dangerousGenerateId(),
      },
      ...defaultResourcesEvents,
      ...defaultStatsEvents,
    ];

    this.publishRoundEvent(...characterSpawnEvents);
  }

  nextRound(battleId?: Battle["id"]) {
    const events: CampaignEventWithRound[] = [
      {
        type: "RoundStarted",
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        battleId,
        serialNumber: this.events[this.events.length - 1]!.serialNumber + 1,
      },
    ];

    this.publishCampaignEvent(...events);
  }

  endRound() {
    const events: CampaignEvent[] = [
      {
        type: "RoundEnded",
        id: dangerousGenerateId(),
      },
    ];

    this.publishCampaignEvent(...events);
  }

  getRoundEvents(round: Round) {
    return this.events.filter((e) => e.roundId === round.id);
  }

  startBattle() {
    const battleId = dangerousGenerateId();

    this.events.push({
      id: dangerousGenerateId(),
      type: "BattleStarted",
      battleId,
      roundId: dangerousGenerateId(),
      serialNumber: this.events[this.events.length - 1]!.serialNumber + 1,
    });

    return battleId;
  }

  getItem(itemId: Item["id"]) {
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
    const healthResource = this.world.ruleset.characterResourceTypes.find((rt) => rt.name === "Health");
    if (!healthResource) {
      throw new Error("Health resource not defined in world, cannot perform attack");
    }

    const actionResource = this.world.ruleset.characterResourceTypes.find((rt) => rt.name === "Primary action");
    if (!actionResource) {
      throw new Error("Primary action resource not defined in world, cannot perform attack");
    }

    const characterHitModifier = attacker.getCharacterHitModifierWithInteraction(interaction);
    const defenderWasHit = defender.armorClass < diceAttackHitRoll + characterHitModifier;
    const hitDodgeEvent: CampaignEvent = defenderWasHit
      ? {
          id: dangerousGenerateId(),
          characterId: defender.id,
          interactionId: interaction.id,
          attackerId: attacker.id,
          type: "CharacterAttackDefenderHit",
        }
      : {
          id: dangerousGenerateId(),
          characterId: defender.id,
          interactionId: interaction.id,
          attackerId: attacker.id,
          type: "CharacterAttackDefenderDodge",
        };

    let defenderCurrentHealth = defender.resources.find((r) => r.resourceTypeId === healthResource.id)!.amount;

    const damageTakenEvents: CampaignEvent[] = defenderWasHit
      ? interaction.appliesEffects.flatMap((attack) => {
          const attackerDamageRoll = attacker.getDamageRoll(attack);
          const defenderDamageTaken = defender.getEffectDamageTaken(attack, attackerDamageRoll);

          defenderCurrentHealth -= defenderDamageTaken;

          return [
            {
              id: dangerousGenerateId(),
              characterId: defender.id,
              interactionId: interaction.id,
              type: "CharacterResourceCurrentChange",
              resourceTypeId: healthResource.id,
              amount: defenderCurrentHealth,
            } satisfies CampaignEvent,
          ];
        })
      : [];

    const statusChangeEvents = defenderWasHit
      ? interaction.appliesEffects
          .filter((attack) => {
            const status = this.world!.statuses.find((s) => s.id === attack.appliesStatusId);
            return status !== undefined;
          })
          .flatMap((attack) => {
            const defenderStatus = defender.getEffectAppliedStatuses(
              this.world!.statuses.find((s) => s.id === attack.appliesStatusId)
            );

            return {
              id: dangerousGenerateId(),
              characterId: defender.id,
              interactionId: interaction.id,
              type: "CharacterStatusGain",
              statusId: defenderStatus!.id,
            } satisfies CampaignEvent;
          })
      : [];

    const attackerPrimaryAction = {
      id: dangerousGenerateId(),
      characterId: attacker.id,
      interactionId: interaction.id,
      resourceTypeId: actionResource.id,
      type: "CharacterResourceCurrentChange",
      amount: 0,
    } satisfies CampaignEvent;

    return this.publishCampaignEvent(
      ...[attackerPrimaryAction, hitDodgeEvent, ...damageTakenEvents, ...statusChangeEvents]
    );
  }

  publishRoundEvent(...newEvents: CampaignEvent[]) {
    const currentCampaignState = this.getCampaignStateFromEvents();
    const currentRound = currentCampaignState.getCurrentRound();
    const lastSerialNumber = this.events[this.events.length - 1]?.serialNumber || 0;
    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      return {
        ...e,
        roundId: currentRound.id,
        serialNumber: lastSerialNumber + i + 1,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  publishCampaignEvent(...newEvents: CampaignEvent[]) {
    const currentCampaignState = this.getCampaignStateFromEvents();
    const currentBattle = currentCampaignState.getCurrentBattle();
    const currentRound = currentCampaignState.getCurrentRound();
    const lastSerialNumber = this.events[this.events.length - 1]?.serialNumber || 0;

    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      return {
        ...e,
        battleId: currentBattle?.id,
        roundId: currentRound.id,
        serialNumber: lastSerialNumber + i + 1,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  getCharacterRoundEvents(round: Round, characterId: Character["id"]) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  endCharacterTurn(actor: Actor) {
    this.publishCampaignEvent({
      type: "CharacterEndRound",
      id: dangerousGenerateId(),
      characterId: actor.id,
    });
  }

  getCharacterLevel(character: Character) {
    const levelProgression = this.world!.ruleset.levelProgression.slice();
    const levelInfo = levelProgression.find((l) => l.requiredXp >= character.xp);
    if (!levelInfo) throw new Error(`Cannot find level progression for xp: ${character.xp}`);
    return levelInfo.unlocksLevel;
  }

  isValidEvent(event: CampaignEventWithRound) {
    return event.serialNumber !== undefined;
  }

  getCampaignStateFromEvents() {
    const worldState = new CampaignState(this, [], [], []);
    this.events
      .filter(this.isValidEvent)
      .sort((a, b) => a.serialNumber - b.serialNumber)
      .forEach((e) => this.applyEvent(e, worldState));
    return worldState;
  }

  applyEvent(event: CampaignEventWithRound, campaignState: CampaignState) {
    switch (event.type) {
      case "CampaignStarted": {
        break;
      }

      case "RoundStarted": {
        campaignState.rounds.push({
          id: event.roundId,
        });
        campaignState.characters.forEach((c) => c.resetResources());
        break;
      }

      case "BattleStarted": {
        campaignState.battles.push(
          new Battle({
            id: event.battleId,
            name: "Battle",
          })
        );

        break;
      }

      case "CharacterSpawned": {
        campaignState.characters.push(new Character({ id: event.characterId }));
        break;
      }

      case "RoundEnded": {
        break;
      }

      case "MonsterBattleEnter": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const monsterDefinition = this.world.monsters.find((m) => m.id === event.monsterId);
        if (!monsterDefinition) {
          throw new Error("Cannot find monster definition");
        }

        battle.addBattleActor(
          new MonsterInstance({
            id: dangerousGenerateId(),
            name: monsterDefinition.name,
            definition: monsterDefinition,
          })
        );
        break;
      }

      case "CharacterBattleEnter":
      case "CharacterStatChange":
      case "CharacterExperienceSet":
      case "CharacterResourceMaxSet":
      case "CharacterExperienceChanged":
      case "CharacterBaseDefenseSet":
      case "CharacterNameSet":
      case "CharacterActionGain":
      case "CharacterDespawn":
      case "CharacterStartRound":
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
      case "CharacterClassReset":
      case "CharacterBattleInitiativeSet":
      case "CharacterClassLevelGain":
        {
          const character = campaignState.characters.find((c) => c.id === event.characterId);
          if (!character) {
            throw new Error(`Character ${event.characterId} not found when processing ${event.type}`);
          }

          this.applyCharacterEvent(character, campaignState, event);
        }
        break;

      default:
        console.warn(`Unknown event type ${event.type}`);
    }
  }

  applyCharacterEvent(character: Character, campaignState: CampaignState, event: CampaignEventWithRound) {
    switch (event.type) {
      case "RoundStarted": {
        character.resetResources();
        break;
      }

      case "CharacterEndRound": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const characterBattle = battle.entities.find((e) => e.actor.id === event.characterId);
        if (!characterBattle) {
          throw new Error("Cannot find battle character");
        }

        break;
      }

      case "CharacterBattleInitiativeSet": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const characterBattle = battle.entities.find((e) => e.actor.id === event.characterId);

        if (!characterBattle) {
          throw new Error("Cannot find battle character");
        }

        characterBattle.initiative = event.initiative;
        break;
      }

      case "CharacterBattleEnter": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const character = campaignState.characters.find((m) => m.id === event.characterId);

        if (!character) {
          throw new Error("Cannot find character");
        }

        battle.addBattleActor(character);
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
        const resource = character.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          character.resources.push({
            amount: event.max,
            max: event.max,
            min: 0,
            resourceTypeId: event.resourceTypeId,
          });
          break;
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

      case "CharacterSpawned": {
        character.exists = true;
        break;
      }

      case "CharacterDespawn": {
        character.exists = false;
        break;
      }

      case "CharacterResourceCurrentChange": {
        const resource = character.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find resource ${event.resourceTypeId}`);
        }

        resource.amount = event.amount;
        break;
      }

      case "CharacterPositionSet": {
        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterPositionSet");
        }

        character.position = event.targetPosition;
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
        const availableReactions = character.reactions.filter((r) => r.eventType === "CharacterAttackDefenderDodge");

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

      case "CharacterClassReset": {
        character.classes = [];
        break;
      }

      case "CharacterClassLevelGain": {
        const characterClassLevels = character.classes.length;
        const characterLevel = this.getCharacterLevel(character);

        if (characterClassLevels >= characterLevel) {
          throw new Error("Cannot add class levels to character, character level not high enough");
        }

        const clazz = this.world!.classes.find((c) => c.id === event.classId);
        if (!clazz) {
          throw new Error("Class not found");
        }

        const characterClass = character.classes.find((c) => c.classId === event.classId);

        if (!characterClass) {
          character.classes.push({ classId: event.classId, level: 1 });
          break;
        }

        characterClass.level = characterClass.level + 1;
        break;
      }

      case "CharacterStatusGain": {
        const status = this.world!.statuses.find((s) => s.id === event.statusId);
        if (!status) {
          throw new Error(`Could not find status with id ${event.statusId} for CharacterStatusGain`);
        }

        character.statuses.push(status);
        break;
      }

      case "CharacterItemGain": {
        const item = this.world!.items.find((eq) => eq.id === event.itemId);
        if (!item) {
          throw new Error(`Could not find item with id ${event.itemId} for CharacterGainItem`);
        }

        character.inventory.push(item);
        break;
      }

      case "CharacterEquipmentSlotGain": {
        const characterSlot = this.world!.ruleset.characterEquipmentSlots.find(
          (slot) => slot.id === event.equipmentSlotId
        );

        if (!characterSlot) {
          throw new Error("Cannot find slot");
        }

        const existing = character.equipment.find((eq) => eq.slotId === event.equipmentSlotId);

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

        const characterHasItem = character.inventory.find((eq) => eq.id === event.itemId);
        if (!characterHasItem) {
          throw new Error(`Could not find item on character`);
        }

        const slot = character.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = item;

        break;
      }

      case "CharacterMovement": {
        const resourceType = this.world!.ruleset.characterResourceTypes.find((r) => r.name === "Movement speed");

        if (!resourceType) {
          throw new Error("Movement resource not defined in world");
        }

        const characterMovementResource = character.resources.find((r) => r.resourceTypeId === resourceType.id);

        if (!characterMovementResource) {
          throw new Error("Character does not have a defined movement speed resource");
        }

        if (!event.targetPosition) {
          throw new Error("Target position not defined for CharacterMovement");
        }

        const distanceX = character.position.x + event.targetPosition.x;
        const distanceY = character.position.y + event.targetPosition.y;
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        if (distance > characterMovementResource.amount) {
          throw new Error("Movement exceeds remaining speed for CharacterMovement");
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
