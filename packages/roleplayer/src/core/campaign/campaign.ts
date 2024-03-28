import { Id, dangerousGenerateId } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { Actor, CharacterClass, CharacterInventoryItem, CharacterStat, isCharacterEvent } from "../actor/character";
import { Battle } from "../battle/battle";
import { ActionDefinition } from "../action/action";
import { EquipmentSlotDefinition, ItemDefinition } from "../inventory/item";
import { World } from "../world/world";
import { CampaignEvent, CampaignEventWithRound, RoleplayerEvent } from "../events/events";
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

  addCharacterItem(characterId: Actor["id"], itemDefinitionId: ItemDefinition["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      itemDefinitionId: itemDefinitionId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemGain",
      itemInstanceId: dangerousGenerateId(),
    };

    this.publishCampaignEvent(actionGain);
  }

  removeCharacterItem(characterId: Actor["id"], characterInventoryItemId: CharacterInventoryItem["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      characterInventoryItemId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemLoss",
    };

    this.publishCampaignEvent(actionGain);
  }

  addCharacterEquipmentSlot(characterId: Actor["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterEquipmentSlotGain",
    };

    this.publishCampaignEvent(equipEvent);
  }

  characterUnEquipItem(
    characterId: Actor["id"],
    equipmentSlotId: EquipmentSlotDefinition["id"],
    itemId?: ItemDefinition["id"]
  ) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      itemId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemUnEquip",
    };

    this.publishCampaignEvent(equipEvent);
  }

  characterEquipItem(
    characterId: Actor["id"],
    equipmentSlotId: EquipmentSlotDefinition["id"],
    itemId: ItemDefinition["id"]
  ) {
    const equipEvent: CampaignEvent = {
      characterId,
      itemId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemEquip",
    };

    this.publishCampaignEvent(equipEvent);
  }

  addActionToCharacter(characterId: Actor["id"], actionId: ActionDefinition["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      actionId,
      id: dangerousGenerateId(),
      type: "CharacterActionGain",
    };

    this.publishCampaignEvent(actionGain);
  }

  setCharacterStats(characterId: Actor["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: dangerousGenerateId(),
    }));

    this.publishCampaignEvent(...statsEvents);
  }

  setCharacterClasses(characterId: Actor["id"], classes: CharacterClass[]) {
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

  setCharacterName(characterId: Actor["id"], name: string) {
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterNameSet",
      name,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  // TODO: Move to a D&D specific ruleset
  setCharacterBaseDefense(characterId: Actor["id"], defense: number) {
    const defenseStatId = this.world.ruleset.getCharacterStatTypes().find((st) => st.name === "Defense")!.id;
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterStatChange",
      amount: defense,
      statId: defenseStatId,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  characterGainExperience(characterId: Actor["id"], experience: number) {
    const characterUpdate: CampaignEvent = {
      characterId,
      id: dangerousGenerateId(),
      type: "CharacterExperienceChanged",
      experience,
    };

    this.publishCampaignEvent(characterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Actor["id"]) {
    const actor = this.world.characters.find((c) => c.id === characterId);
    if (!actor) {
      throw new Error("Actor not found");
    }

    const order = this.world.ruleset.characterBattleActionOrder(actor);
    const characterBattleEnter: CampaignEvent[] = [
      {
        characterId,
        id: dangerousGenerateId(),
        type: "CharacterBattleEnter",
      },
      {
        characterId,
        id: dangerousGenerateId(),
        type: "CharacterBattleCharacterOrderSet",
        order: order,
      },
    ];

    this.publishCampaignEvent(...characterBattleEnter);
  }

  createCharacter(characterId: Actor["id"], name: string) {
    const defaultResourcesEvents: CampaignEvent[] = this.world!.ruleset.getCharacterResourceTypes().map((cr) => ({
      type: "CharacterResourceMaxSet",
      max: cr.defaultMax || 0,
      characterId,
      resourceTypeId: cr.id,
      id: dangerousGenerateId(),
    }));

    const defaultStatsEvents: CampaignEvent[] = this.world!.ruleset.getCharacterStatTypes().map((st) => ({
      type: "CharacterStatChange",
      amount: 0,
      characterId,
      statId: st.id,
      id: dangerousGenerateId(),
    }));

    const defaultEquipmentSlotEvents: CampaignEvent[] = this.world!.ruleset.getCharacterEquipmentSlots().map((es) => ({
      type: "CharacterEquipmentSlotGain",
      characterId,
      equipmentSlotId: es.id,
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
        type: "CharacterStatChange",
        amount: 10,
        characterId,
        statId: this.world.ruleset.getCharacterStatTypes().find((st) => st.name === "Defense")!.id,
        id: dangerousGenerateId(),
      },
      ...defaultEquipmentSlotEvents,
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

  performCharacterAttack(attacker: Actor, actionDef: ActionDefinition, targets: Actor[]) {
    const characterAction = attacker.action(actionDef);
    const characterActionHitRoll = characterAction.rolls.find((r) => r.name === "Hit");
    if (!characterActionHitRoll) {
      throw new Error("Hit roll not defined for character action");
    }

    const healthResource = this.world.ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");
    if (!healthResource) {
      throw new Error("Health resource not defined in world, cannot perform attack");
    }

    const actionResource = this.world.ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Primary action");
    if (!actionResource) {
      throw new Error("Primary action resource not defined in world, cannot perform attack");
    }

    const targetReceiveAttackEvents = targets.flatMap((target) => {
      if (attacker.tryHit(target)) {
        return actionDef.appliesEffects.map((effect) => effect.instantiate(actionDef, attacker, target, this.world));
      }

      return [];
    });

    const characterResourceLoss: CampaignEvent[] = actionDef.requiresResources.map((rr) => ({
      type: "CharacterResourceLoss",
      characterId: attacker.id,
      resourceTypeId: rr.resourceTypeId,
      amount: rr.amount,
      id: dangerousGenerateId(),
    }));

    return this.publishCampaignEvent(...characterResourceLoss, ...targetReceiveAttackEvents);
  }

  endCharacterTurn(actor: Actor) {
    this.publishCampaignEvent({
      type: "CharacterEndRound",
      id: dangerousGenerateId(),
      characterId: actor.id,
    });
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

  getCharacterRoundEvents(round: Round, characterId: Actor["id"]) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  getCharacterLevel(character: Actor) {
    const levelProgression = this.world!.ruleset.getLevelProgression().slice();
    const levelInfo = levelProgression.find((l) => l.requiredXp >= character.xp);
    if (!levelInfo) throw new Error(`Cannot find level progression for xp: ${character.xp}`);
    return levelInfo.unlocksLevel;
  }

  getBattleEvents(battleId: Battle["id"]) {
    return this.events.filter((e) => e.battleId === battleId);
  }

  isValidEvent(event: CampaignEventWithRound) {
    return event.serialNumber !== undefined;
  }

  getCampaignStateFromEvents() {
    const campaignState = new CampaignState(this, [], [], []);
    const sorted = this.events.filter(this.isValidEvent).toSorted((a, b) => a.serialNumber - b.serialNumber);

    try {
      sorted.forEach((e) => this.applyEvent(e, campaignState));

      return campaignState;
    } catch (e) {
      this.debugEventProcessing(campaignState, sorted);
      throw e;
    }
  }

  applyEvent(event: CampaignEventWithRound, campaignState: CampaignState) {
    try {
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
          campaignState.characters.push(new Actor(this.world, { id: event.characterId }));
          break;
        }

        case "RoundEnded": {
          break;
        }

        case "CharacterBattleEnter":
        case "CharacterStatChange":
        case "CharacterExperienceSet":
        case "CharacterResourceMaxSet":
        case "CharacterExperienceChanged":
        case "CharacterNameSet":
        case "CharacterActionGain":
        case "CharacterDespawn":
        case "CharacterMovement":
        case "CharacterEndRound":
        case "CharacterInventoryItemGain":
        case "CharacterInventoryItemLoss":
        case "CharacterInventoryItemEquip":
        case "CharacterEquipmentSlotGain":
        case "CharacterPositionSet":
        case "CharacterResourceGain":
        case "CharacterResourceLoss":
        case "CharacterStatusGain":
        case "CharacterAttackAttackerHit":
        case "CharacterAttackAttackerMiss":
        case "CharacterAttackDefenderHit":
        case "CharacterAttackDefenderDodge":
        case "CharacterAttackDefenderParry":
        case "CharacterClassReset":
        case "CharacterBattleCharacterOrderSet":
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
    } catch (e) {
      this.debugEvent(event);
      throw e;
    }
  }

  applyCharacterEvent(character: Actor, campaignState: CampaignState, event: CampaignEventWithRound) {
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

      case "CharacterBattleCharacterOrderSet": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const characterBattle = battle.entities.find((e) => e.actor.id === event.characterId);

        if (!characterBattle) {
          throw new Error("Cannot find battle character");
        }

        characterBattle.actingOrder = event.order;
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

      case "CharacterResourceMaxSet": {
        const resource = character.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          character.resources.push({
            amount: 0,
            max: event.max,
            min: 0,
            resourceTypeId: event.resourceTypeId,
          });
          break;
        }

        resource.max = event.max;
        break;
      }

      case "CharacterResourceGain": {
        const resource = character.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find resource ${event.resourceTypeId}`);
        }

        resource.amount += event.amount;
        break;
      }

      case "CharacterResourceLoss": {
        const resource = character.resources.find((r) => r.resourceTypeId === event.resourceTypeId);

        if (!resource) {
          throw new Error(`Cannot find resource ${event.resourceTypeId}`);
        }

        resource.amount -= event.amount;
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

      case "CharacterInventoryItemGain": {
        const item = this.world!.itemDefinitions.find((eq) => eq.id === event.itemDefinitionId);
        if (!item) {
          throw new Error(`Could not find item with id ${event.itemDefinitionId} for CharacterGainItem`);
        }

        character.inventory.push({ id: event.itemInstanceId, definition: item });
        break;
      }

      case "CharacterEquipmentSlotGain": {
        const characterSlot = this.world!.ruleset.getCharacterEquipmentSlots().find(
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

      case "CharacterInventoryItemEquip": {
        const characterHasItem = character.inventory.find((eq) => eq.id === event.itemId);
        if (!characterHasItem) {
          throw new Error(`Could not find item on character`);
        }

        const slot = character.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = characterHasItem;

        break;
      }

      case "CharacterMovement": {
        const resourceType = this.world!.ruleset.getCharacterResourceTypes().find((r) => r.name === "Movement speed");

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

  debugEvent(event: RoleplayerEvent) {
    console.table(event);
  }

  debugEventProcessing(campaignState: CampaignState, events: CampaignEventWithRound[]) {
    console.table(this.world.itemDefinitions);
  }
}
