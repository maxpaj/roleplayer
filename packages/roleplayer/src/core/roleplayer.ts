import {
  Actor,
  CampaignState,
  generateId,
  isBattleEvent,
  mapEffect,
  type ActionDefinition,
  type Battle,
  type CampaignEvent,
  type CharacterClass,
  type CharacterInventoryItem,
  type CharacterStat,
  type EquipmentSlotDefinition,
  type ItemDefinition,
  type RoleplayerEvent,
  type Ruleset,
} from "..";
import type { Logger } from "../lib/logging/logger";
import type { WithRequired } from "../types/with-required";
import Observable from "./observable";

type RoleplayerCampaignParameters = Omit<ConstructorParameters<typeof CampaignState>[0], "roleplayer" | "ruleset">;

/**
 * The core of this library contains a few systems that are common for most or all roleplaying games.
 * It is designed to be extended and customized to fit the needs of a roleplaying game.
 *
 * - Action and effects system
 * - Battle system
 *    - NPC actions
 *    - Resource generation system
 *    - Round action tracking
 * - Character system
 *    - Resource system
 *    - Inventory system
 *    - Stats system
 *    - Level progression system
 * - World building system
 * - NPC system
 *    - Relationship system
 * - Dice rolling system
 * - Campaign system
 *    - Factions/relationships system
 *    - Quest system
 *    - Exploration system
 *
 * It is all backed up by a rich event system where subsystems can subscribe and publish events.
 *
 */
export class Roleplayer extends Observable<RoleplayerEvent> {
  ruleset!: Ruleset;

  events: RoleplayerEvent[];
  campaign: CampaignState;
  logger?: Logger;

  constructor(
    config: WithRequired<Partial<Roleplayer>, "ruleset">,
    initialCampaignConfig: RoleplayerCampaignParameters
  ) {
    super();
    Object.assign(this, config);

    this.subscribe(this.applyEvent.bind(this));
    this.events = this.createEventsProxy(config.events ?? []);
    this.campaign = new CampaignState({
      ...initialCampaignConfig,
      roleplayer: this,
      ruleset: config.ruleset,
    });
  }

  createEventsProxy(events: RoleplayerEvent[]) {
    return new Proxy(events, {
      set: (target, property, value, receiver) => {
        const index = Number(property);
        if (!Number.isNaN(index)) this.notify(value);
        return Reflect.set(target, property, value, receiver);
      },
    });
  }

  nextSerialNumber() {
    const sortedEvents = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);
    const lastSerialNumber = sortedEvents[sortedEvents.length - 1]?.serialNumber ?? 0;
    return lastSerialNumber + 1;
  }

  publishEvent(...newEvents: CampaignEvent[]) {
    for (const event of newEvents) {
      const eventSerialNumber = this.nextSerialNumber();
      const currentRoundId = this.campaign.getCurrentRound().id;

      if (isBattleEvent(event)) {
        const roleplayerEvent = {
          ...event,
          id: generateId(),
          battleId: event.battleId,
          roundId: currentRoundId,
          serialNumber: eventSerialNumber,
        };

        this.events.push(roleplayerEvent);
        return;
      }

      const currentBattleId = this.campaign.getCurrentBattle()?.id;
      const roleplayerEvent = {
        ...event,
        id: generateId(),
        battleId: currentBattleId,
        roundId: currentRoundId,
        serialNumber: eventSerialNumber,
      };

      this.events.push(roleplayerEvent);
    }
    return newEvents;
  }

  getCampaignFromEvents() {
    return this.campaign;
  }

  startCampaign() {
    if (this.campaign.rounds.length > 0) {
      throw new Error("Campaign already started");
    }
    const campaignStartEvents: CampaignEvent[] = [
      {
        type: "CampaignStarted",
      },
      {
        type: "RoundStarted",
      },
    ];

    this.publishEvent(...campaignStartEvents);
  }

  addCharacterItem(characterId: Actor["id"], itemDefinitionId: ItemDefinition["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      itemDefinitionId: itemDefinitionId,
      type: "CharacterInventoryItemGain",
      itemInstanceId: generateId(),
    };

    this.publishEvent(actionGain);
  }

  removeCharacterItem(characterId: Actor["id"], characterInventoryItemId: CharacterInventoryItem["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      characterInventoryItemId,
      type: "CharacterInventoryItemLoss",
    };

    this.publishEvent(actionGain);
  }

  addCharacterEquipmentSlot(characterId: Actor["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      type: "CharacterEquipmentSlotGain",
    };

    this.publishEvent(equipEvent);
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
      type: "CharacterInventoryItemUnEquip",
    };

    this.publishEvent(equipEvent);
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
    };

    this.publishEvent(equipEvent);
  }

  addActionToCharacter(characterId: Actor["id"], actionId: ActionDefinition["id"]) {
    const actionGain: CampaignEvent = {
      type: "CharacterActionGain",
      characterId,
      actionId,
    };

    this.publishEvent(actionGain);
  }

  setCharacterStats(characterId: Actor["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
    }));

    this.publishEvent(...statsEvents);
  }

  setCharacterClasses(characterId: Actor["id"], classes: CharacterClass[]) {
    const classResetEvent: CampaignEvent = {
      type: "CharacterClassReset",
      characterId,
    };

    const classUpdates: CampaignEvent[] = classes.map((c) => ({
      type: "CharacterClassLevelGain",
      characterId,
      classId: c.classId,
    }));

    this.publishEvent(...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(characterId: Actor["id"], name: string) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterNameSet",
      characterId,
      name,
    };

    this.publishEvent(characterUpdate);
  }

  characterGainExperience(characterId: Actor["id"], experience: number) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterExperienceChanged",
      characterId,
      experience,
    };

    this.publishEvent(characterUpdate);
  }

  addCharacterToCurrentBattle(characterId: Actor["id"]) {
    const actor = this.campaign.characters.find((c) => c.id === characterId);
    if (!actor) {
      throw new Error("Actor not found");
    }

    const currentBattle = this.campaign.getCurrentBattle();
    if (!currentBattle) {
      throw new Error("No current battle");
    }

    const characterBattleEnter: CampaignEvent[] = [
      {
        type: "CharacterBattleEnter",
        characterId,
        battleId: currentBattle.id,
      },
    ];

    this.publishEvent(...characterBattleEnter);
  }

  spawnCharacterFromTemplate(templateId: Actor["id"]) {
    const template = this.campaign.actorTemplates.find((c) => c.id === templateId);
    if (!template) {
      throw new Error("Template character not found");
    }

    const characterId = generateId();
    const characterSpawnEvents: CampaignEvent[] = [
      {
        type: "CharacterSpawned",
        characterId,
        templateCharacterId: templateId,
      },
    ];

    this.publishEvent(...characterSpawnEvents);

    return characterId;
  }

  dispatchAddBattleActorEvent(actorId: Actor["id"]) {
    const currentBattle = this.campaign.getCurrentBattle();
    if (!currentBattle) {
      throw new Error("No current battle");
    }
    const characterBattleEnter: CampaignEvent = {
      type: "CharacterBattleEnter" as const,
      characterId: actorId,
      battleId: currentBattle.id,
    };

    this.publishEvent(characterBattleEnter);
  }

  createCharacter(characterId: Actor["id"], name: string) {
    const defaultResourcesEvents: CampaignEvent[] = this.ruleset.getCharacterResourceTypes().map((cr) => ({
      type: "CharacterResourceMaxSet",
      max: cr.defaultMax || 0,
      characterId,
      resourceTypeId: cr.id,
    }));

    const resourcesGainEvents: CampaignEvent[] = this.ruleset.getCharacterResourceTypes().map((cr) => ({
      type: "CharacterResourceGain",
      amount: cr.defaultMax || 0,
      characterId,
      resourceTypeId: cr.id,
    }));

    const defaultStatsEvents: CampaignEvent[] = this.ruleset.getCharacterStatTypes().map((st) => ({
      type: "CharacterStatChange",
      amount: 0,
      characterId,
      statId: st.id,
    }));

    const defaultEquipmentSlotEvents: CampaignEvent[] = this.ruleset.getCharacterEquipmentSlots().map((es) => ({
      type: "CharacterEquipmentSlotGain",
      characterId,
      equipmentSlotId: es.id,
    }));

    const characterSpawnEvents: CampaignEvent[] = [
      {
        type: "CharacterSpawned",
        characterId,
      },
      {
        type: "CharacterNameSet",
        name: name,
        characterId,
      },
      {
        type: "CharacterExperienceSet",
        experience: 0,
        characterId,
      },
      ...defaultEquipmentSlotEvents,
      ...defaultResourcesEvents,
      ...defaultStatsEvents,
      ...resourcesGainEvents,
    ];

    this.publishEvent(...characterSpawnEvents);
  }

  nextRound(battleId?: Battle["id"]) {
    const newRoundId = generateId();
    const events: RoleplayerEvent[] = [
      {
        id: generateId(),
        type: "RoundStarted",
        roundId: newRoundId,
        battleId,
        serialNumber: this.nextSerialNumber(),
      },
    ];

    this.publishEvent(...events);

    return newRoundId;
  }

  endRound() {
    const events: CampaignEvent[] = [
      {
        type: "RoundEnded",
      },
    ];

    this.publishEvent(...events);
  }

  startBattle() {
    this.publishEvent({
      type: "BattleStarted",
      battleId: generateId(),
    });
  }

  performCharacterAttack(attacker: Actor, actionDef: ActionDefinition, targets: Actor[]) {
    const characterAction = attacker.action(actionDef);

    const characterActionHitRoll = characterAction.rolls.find((r) => r.name === "Hit");
    if (!characterActionHitRoll) {
      throw new Error("Hit roll not defined for character action");
    }

    const healthResource = this.ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");
    if (!healthResource) {
      throw new Error("Health resource not defined in world, cannot perform attack");
    }

    const targetReceiveAttackEvents = targets.flatMap((target) => {
      if (attacker.tryHit(target)) {
        return actionDef.appliesEffects.map((effect) => mapEffect(effect, actionDef, attacker, target, this.ruleset));
      }

      return [];
    });

    const characterResourceLoss: CampaignEvent[] = actionDef.requiresResources.map((rr) => ({
      type: "CharacterResourceLoss",
      characterId: attacker.id,
      resourceTypeId: rr.resourceTypeId,
      amount: rr.amount,
    }));

    return this.publishEvent(...characterResourceLoss, ...targetReceiveAttackEvents);
  }

  endCharacterTurn(actor: Actor) {
    const currentBattle = this.campaign.getCurrentBattle();
    if (!currentBattle) {
      throw new Error("No current battle");
    }
    this.publishEvent({
      type: "CharacterEndTurn",
      characterId: actor.id,
      battleId: currentBattle.id,
    });
  }

  applyEvent(event: RoleplayerEvent) {
    switch (event.type) {
      case "CampaignStarted": {
        break;
      }

      case "RoundStarted": {
        this.campaign.rounds.push({
          id: event.roundId,
          roundNumber: event.serialNumber,
        });

        for (const character of this.campaign.characters) {
          const characterResourceGeneration = this.ruleset.characterResourceGeneration(character);
          character.resetResources(characterResourceGeneration);
        }

        break;
      }

      case "CharacterSpawned": {
        const templateCharacter = this.campaign.actorTemplates.find((c) => c.id === event.templateCharacterId);
        const alreadySpawnedTemplateCharacters = this.campaign.characters.filter(
          (c) => c.templateCharacterId === event.templateCharacterId
        );

        if (!templateCharacter) {
          this.campaign.characters.push(new Actor({ id: event.characterId, campaign: this.campaign }));
        } else {
          this.campaign.characters.push(
            new Actor({
              ...structuredClone(templateCharacter),
              campaign: this.campaign,
              id: event.characterId,
              templateCharacterId: event.templateCharacterId,
              name: `${templateCharacter.name} #${alreadySpawnedTemplateCharacters.length}`,
            })
          );
        }
        break;
      }

      default:
        this.logger?.warn(`Unknown event type ${event.type}`);
    }
  }

  debugEvent(event: RoleplayerEvent) {
    // this.logger.table(event);
  }

  debugEventProcessing(events: RoleplayerEvent[]) {
    // this.logger.log(this.campaign.characters);
  }
}
