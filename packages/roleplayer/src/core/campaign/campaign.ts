import { dangerousGenerateId, type Id } from "../../lib/generate-id";
import type { Logger } from "../../lib/logging/logger";
import type { AugmentedRequired } from "../../types/with-required";
import type { ActionDefinition } from "../action/action";
import { mapEffect } from "../action/effect";
import {
  Actor,
  isCharacterEvent,
  type CharacterClass,
  type CharacterInventoryItem,
  type CharacterStat,
} from "../actor/character";
import { Battle } from "../battle/battle";
import type { CampaignEvent, CampaignEventWithRound, RoleplayerEvent } from "../events/events";
import type { EquipmentSlotDefinition, ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import type { World } from "../world/world";
import { CampaignState } from "./campaign-state";
import type { Round } from "./round";

export class Campaign {
  id: Id;
  name: string;
  world: World;
  roleplayer: Roleplayer;
  logger?: Logger;

  constructor(c: AugmentedRequired<Partial<Campaign>, "id" | "name" | "world" | "roleplayer">, logger?: Logger) {
    Object.assign(this, c);

    this.id = c.id;
    this.name = c.name;
    this.world = c.world;
    this.roleplayer = c.roleplayer;
    this.logger = logger;
  }

  startCampaign() {
    const campaignStartEvents: CampaignEventWithRound[] = [
      {
        id: dangerousGenerateId(),
        type: "CampaignStarted",
        roundId: "00000000-0000-0000-0000-000000000000",
        campaignId: this.id,
        serialNumber: 0,
      },
      {
        type: "RoundStarted",
        campaignId: this.id,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 1,
      },
    ];

    this.roleplayer.publishCampaignEvent(this, ...campaignStartEvents);
  }

  addCharacterItem(characterId: Actor["id"], itemDefinitionId: ItemDefinition["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      itemDefinitionId: itemDefinitionId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemGain",
      itemInstanceId: dangerousGenerateId(),
    };

    this.roleplayer.publishCampaignEvent(this, actionGain);
  }

  removeCharacterItem(characterId: Actor["id"], characterInventoryItemId: CharacterInventoryItem["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      characterInventoryItemId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemLoss",
    };

    this.roleplayer.publishCampaignEvent(this, actionGain);
  }

  addCharacterEquipmentSlot(characterId: Actor["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterEquipmentSlotGain",
    };

    this.roleplayer.publishCampaignEvent(this, equipEvent);
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

    this.roleplayer.publishCampaignEvent(this, equipEvent);
  }

  characterEquipItem(
    characterId: Actor["id"],
    equipmentSlotId: EquipmentSlotDefinition["id"],
    itemId: ItemDefinition["id"]
  ) {
    const equipEvent: CampaignEvent = {
      type: "CharacterInventoryItemEquip",
      characterId,
      itemId,
      equipmentSlotId,
      id: dangerousGenerateId(),
    };

    this.roleplayer.publishCampaignEvent(this, equipEvent);
  }

  addActionToCharacter(characterId: Actor["id"], actionId: ActionDefinition["id"]) {
    const actionGain: CampaignEvent = {
      type: "CharacterActionGain",
      characterId,
      actionId,
      id: dangerousGenerateId(),
    };

    this.roleplayer.publishCampaignEvent(this, actionGain);
  }

  setCharacterStats(characterId: Actor["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: dangerousGenerateId(),
    }));

    this.roleplayer.publishCampaignEvent(this, ...statsEvents);
  }

  setCharacterClasses(characterId: Actor["id"], classes: CharacterClass[]) {
    const classResetEvent: CampaignEvent = {
      type: "CharacterClassReset",
      characterId,
      id: dangerousGenerateId(),
    };

    const classUpdates: CampaignEvent[] = classes.map((c) => ({
      type: "CharacterClassLevelGain",
      characterId,
      id: dangerousGenerateId(),
      classId: c.classId,
    }));

    this.roleplayer.publishCampaignEvent(this, ...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(characterId: Actor["id"], name: string) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterNameSet",
      characterId,
      id: dangerousGenerateId(),
      name,
    };

    this.roleplayer.publishCampaignEvent(this, characterUpdate);
  }

  // TODO: Move to a D&D specific ruleset
  setCharacterBaseDefense(characterId: Actor["id"], defense: number) {
    const defenseStatId = this.world.ruleset.getCharacterStatTypes().find((st) => st.name === "Defense")!.id;
    const characterUpdate: CampaignEvent = {
      type: "CharacterStatChange",
      characterId,
      id: dangerousGenerateId(),
      amount: defense,
      statId: defenseStatId,
    };

    this.roleplayer.publishCampaignEvent(this, characterUpdate);
  }

  characterGainExperience(characterId: Actor["id"], experience: number) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterExperienceChanged",
      characterId,
      id: dangerousGenerateId(),
      experience,
    };

    this.roleplayer.publishCampaignEvent(this, characterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Actor["id"]) {
    const campaignState = this.getCampaignStateFromEvents();
    const actor = campaignState.characters.find((c) => c.id === characterId);

    if (!actor) {
      throw new Error("Actor not found");
    }

    const order = this.world.ruleset.characterBattleActionOrder(actor);
    const characterBattleEnter: CampaignEvent[] = [
      {
        type: "CharacterBattleEnter",
        characterId,
        id: dangerousGenerateId(),
      },
    ];

    this.roleplayer.publishCampaignEvent(this, ...characterBattleEnter);
  }

  spawnCharacterFromTemplate(templateId: Actor["id"]) {
    const template = this.world.characters.find((c) => c.id === templateId);
    if (!template) {
      throw new Error("Template character not found");
    }

    const characterId = dangerousGenerateId();
    const characterSpawnEvents: CampaignEvent[] = [
      {
        type: "CharacterSpawned",
        characterId,
        templateCharacterId: templateId,
        id: dangerousGenerateId(),
      },
    ];

    const characterResourceEvents: CampaignEvent[] = template.resources.map((r) => ({
      type: "CharacterResourceGain",
      characterId,
      amount: r.max,
      id: dangerousGenerateId(),
      resourceTypeId: r.resourceTypeId,
    }));

    const events = [...characterSpawnEvents, ...characterResourceEvents];

    this.roleplayer.publishCampaignEvent(this, ...events);

    return characterId;
  }

  createCharacter(characterId: Actor["id"], name: string) {
    const defaultResourcesEvents: CampaignEvent[] = this.world!.ruleset.getCharacterResourceTypes().map((cr) => ({
      type: "CharacterResourceMaxSet",
      max: cr.defaultMax || 0,
      characterId,
      resourceTypeId: cr.id,
      id: dangerousGenerateId(),
    }));

    const resourcesGainEvents: CampaignEvent[] = this.world!.ruleset.getCharacterResourceTypes().map((cr) => ({
      type: "CharacterResourceGain",
      amount: cr.defaultMax || 0,
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
      ...resourcesGainEvents,
    ];

    this.publishRoundEvent(...characterSpawnEvents);
  }

  nextRound(battleId?: Battle["id"]) {
    const newRoundId = dangerousGenerateId();
    const events: CampaignEventWithRound[] = [
      {
        type: "RoundStarted",
        id: dangerousGenerateId(),
        roundId: newRoundId,
        battleId,
        serialNumber: this.roleplayer.nextSerialNumber(),
        campaignId: this.id,
      },
    ];

    this.roleplayer.events.push(...events);

    return newRoundId;
  }

  endRound() {
    const events: CampaignEvent[] = [
      {
        type: "RoundEnded",
        id: dangerousGenerateId(),
      },
    ];

    this.roleplayer.publishCampaignEvent(this, ...events);
  }

  getRoundEvents(round: Round) {
    return this.roleplayer.events.filter((e) => e.roundId === round.id);
  }

  startBattle() {
    const battleId = dangerousGenerateId();
    const currentCampaignState = this.getCampaignStateFromEvents();
    const currentRound = currentCampaignState.getCurrentRound();

    this.roleplayer.events.push({
      type: "BattleStarted",
      id: dangerousGenerateId(),
      battleId,
      roundId: currentRound.id,
      serialNumber: this.roleplayer.nextSerialNumber(),
      campaignId: this.id,
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

    const targetReceiveAttackEvents = targets.flatMap((target) => {
      if (attacker.tryHit(target)) {
        return actionDef.appliesEffects.map((effect) => mapEffect(effect, actionDef, attacker, target, this.world));
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

    return this.roleplayer.publishCampaignEvent(this, ...characterResourceLoss, ...targetReceiveAttackEvents);
  }

  endCharacterTurn(actor: Actor) {
    this.roleplayer.publishCampaignEvent(this, {
      type: "CharacterEndRound",
      id: dangerousGenerateId(),
      characterId: actor.id,
    });
  }

  publishRoundEvent(...newEvents: CampaignEvent[]) {
    const currentCampaignState = this.getCampaignStateFromEvents();
    const currentRound = currentCampaignState.getCurrentRound();

    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      const eventSerialNumber = this.roleplayer.nextSerialNumber() + i;
      return {
        ...e,
        roundId: currentRound.id,
        serialNumber: eventSerialNumber,
        campaignId: this.id,
      };
    });

    this.roleplayer.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  getCharacterRoundEvents(round: Round, characterId: Actor["id"]) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  getCharacterEvents(characterId: Actor["id"]) {
    return this.roleplayer.events.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  getCharacterLevel(character: Actor) {
    const levelProgression = this.world!.ruleset.getLevelProgression().slice();
    const levelInfo = levelProgression.find((l) => l.requiredXp >= character.xp);
    if (!levelInfo) throw new Error(`Cannot find level progression for xp: ${character.xp}`);
    return levelInfo.unlocksLevel;
  }

  getBattleEvents(battleId: Battle["id"]) {
    return this.roleplayer.events.filter((e) => e.battleId === battleId);
  }

  getCharacterEligibleTargets(actor: Actor, action: ActionDefinition): Actor[] {
    const campaignState = this.getCampaignStateFromEvents();

    // TODO: Make sure the target is eligible
    return campaignState.characters;
  }

  getCampaignStateFromEvents() {
    const campaignState = new CampaignState([], [], []);
    const sorted = this.roleplayer.events.toSorted((a, b) => a.serialNumber - b.serialNumber);

    try {
      sorted.forEach((e) => {
        this.applyEvent(e, campaignState);
        this.logger?.debug({ event: e, campaignState: campaignState });
      });

      return campaignState;
    } catch (e) {
      this.debugEventProcessing(campaignState, sorted);
      throw e;
    }
  }

  characterIsDead(actor: Actor) {
    return this.world.ruleset.characterIsDead(actor);
  }

  characterHasRoundEvent(round: Round, character: Actor, type: RoleplayerEvent["type"]) {
    const roundCharacterEvents = this.getCharacterRoundEvents(round, character.id);
    return roundCharacterEvents.some((event) => event.type === type);
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
            serialNumber: event.serialNumber,
          });

          campaignState.characters.forEach((c) => {
            const characterResourceGeneration = this.world.ruleset.characterResourceGeneration(c);
            c.resetResources(characterResourceGeneration);
          });
          break;
        }

        case "BattleStarted": {
          if (!event.battleId) throw new Error("BattleStarted event missing battleId");
          campaignState.battles.push(
            new Battle(this.world.ruleset, {
              id: event.battleId,
              name: "Battle",
            })
          );

          break;
        }

        case "CharacterSpawned": {
          const templateCharacter = this.world.characters.find((c) => c.id === event.templateCharacterId);
          const alreadySpawnedTemplateCharacters = campaignState.characters.filter(
            (c) => c.templateCharacterId === event.templateCharacterId
          );

          if (!templateCharacter) {
            campaignState.characters.push(new Actor({ id: event.characterId }));
          } else {
            campaignState.characters.push(
              new Actor({
                ...structuredClone(templateCharacter),
                id: event.characterId,
                templateCharacterId: event.templateCharacterId,
                name: `${templateCharacter.name} #${alreadySpawnedTemplateCharacters.length}`,
              })
            );
          }
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
        case "CharacterInventoryItemUnEquip":
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
          this.logger?.warn(`Unknown event type ${event.type}`);
      }
    } catch (e) {
      this.debugEvent(event);
      throw e;
    }
  }

  applyCharacterEvent(character: Actor, campaignState: CampaignState, event: CampaignEventWithRound) {
    switch (event.type) {
      case "CharacterEndRound": {
        const battle = campaignState.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const characterBattle = battle.actors.find((actor) => actor.id === event.characterId);
        if (!characterBattle) {
          throw new Error("Cannot find battle character");
        }

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

      case "CharacterInventoryItemLoss": {
        // Remove equipped item if it was equipped
        character.equipment = character.equipment.map((eq) => {
          const equipped = eq.item!.id === event.characterInventoryItemId;
          if (equipped) {
            eq.item = undefined;
          }

          return eq;
        });

        // Remove from inventory
        character.inventory = character.inventory.filter((eq) => eq.id === event.characterInventoryItemId);

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

        if (slot.item) {
          throw new Error("Slot already has item");
        }

        slot.item = characterHasItem;

        break;
      }

      case "CharacterInventoryItemUnEquip": {
        const slot = character.equipment.find((e) => e.slotId === event.equipmentSlotId);
        if (!slot) {
          throw new Error(`Could not find slot on event`);
        }

        slot.item = undefined;

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
        this.logger?.warn(`Unhandled event ${event.id}, type ${event.type}`);
        throw new Error(`Unhandled event type ${event.type}`);
    }
  }

  debugEvent(event: RoleplayerEvent) {
    // this.logger.table(event);
  }

  debugEventProcessing(campaignState: CampaignState, events: CampaignEventWithRound[]) {
    // this.logger.log(campaignState.characters);
  }
}
