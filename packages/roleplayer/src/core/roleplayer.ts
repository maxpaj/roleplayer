import {
  Actor,
  CampaignState,
  generateId,
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
import type { AugmentedRequired } from "../types/with-required";
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
  _eventsTarget: RoleplayerEvent[] = [];

  events: RoleplayerEvent[];
  campaign: CampaignState;
  logger?: Logger;

  constructor(
    config: AugmentedRequired<Partial<Roleplayer>, "ruleset">,
    initialCampaignConfig: RoleplayerCampaignParameters
  ) {
    super();
    Object.assign(this, config);

    this.subscribe(this.applyEvent.bind(this));
    this.events = new Proxy<RoleplayerEvent[]>(this._eventsTarget, {
      set: (target, property, value, receiver) => {
        if (typeof property === "string" && !Number.isNaN(+property)) this.notify(value);
        return Reflect.set(target, property, value, receiver);
      },
    });
    this.campaign = new CampaignState({
      ...initialCampaignConfig,
      roleplayer: this,
      ruleset: config.ruleset,
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
      let rpEvent: RoleplayerEvent;
      try {
        const currentRoundId = event.type === "RoundStarted" ? event.roundId : this.campaign.getCurrentRound().id;
        const currentBattleId = this.campaign.getCurrentBattle()?.id;
        rpEvent = {
          ...event,
          id: generateId(),
          battleId: currentBattleId,
          roundId: currentRoundId,
          serialNumber: eventSerialNumber,
        };
      } catch (e) {
        console.warn(e);
        rpEvent = {
          ...event,
          id: generateId(),
          serialNumber: eventSerialNumber,
        };
      }
      this.events.push(rpEvent);
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
    const roundId = generateId();
    const campaignStartEvents: CampaignEvent[] = [
      {
        type: "CampaignStarted",
      },
      {
        type: "RoundStarted",
        roundId,
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

    const characterBattleEnter: CampaignEvent[] = [
      {
        type: "CharacterBattleEnter",
        characterId,
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

    const characterResourceEvents: CampaignEvent[] = template.resources.map((r) => ({
      type: "CharacterResourceGain",
      characterId,
      amount: r.max,
      resourceTypeId: r.resourceTypeId,
    }));

    const events = [...characterSpawnEvents, ...characterResourceEvents];

    this.publishEvent(...events);

    return characterId;
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
      {
        type: "CharacterStatChange",
        amount: 10,
        characterId,
        statId: this.ruleset.getCharacterStatTypes().find((st) => st.name === "Defense")!.id,
      },
      ...defaultEquipmentSlotEvents,
      ...defaultResourcesEvents,
      ...defaultStatsEvents,
      ...resourcesGainEvents,
    ];

    this.publishRoundEvent(...characterSpawnEvents);
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

    this.events.push(...events);

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
    const currentRound = this.campaign.getCurrentRound();
    const battleId = generateId();

    this.events.push({
      id: generateId(),
      type: "BattleStarted",
      battleId,
      roundId: currentRound.id,
      serialNumber: this.nextSerialNumber(),
    });

    return battleId;
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
    this.publishEvent({
      type: "CharacterEndTurn",
      characterId: actor.id,
    });
  }

  publishRoundEvent(...newEvents: CampaignEvent[]) {
    const currentRound = this.campaign.getCurrentRound();

    const eventsWithRoundAndBattle = newEvents.map((e): RoleplayerEvent => {
      const eventSerialNumber = this.nextSerialNumber();
      return {
        ...e,
        id: generateId(),
        roundId: currentRound.id,
        serialNumber: eventSerialNumber,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  applyEvent(event: RoleplayerEvent) {
    switch (event.type) {
      case "CampaignStarted": {
        break;
      }

      case "RoundStarted": {
        this.campaign.rounds.push({
          id: event.roundId,
          serialNumber: event.serialNumber,
        });

        this.campaign.characters.forEach((c) => {
          const characterResourceGeneration = this.ruleset.characterResourceGeneration(c);
          c.resetResources(characterResourceGeneration);
        });
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
