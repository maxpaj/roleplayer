import { dangerousGenerateId } from "../../lib/generate-id";
import type { Logger } from "../../lib/logging/logger";
import type { ActionDefinition } from "../action/action";
import { mapEffect } from "../action/effect";
import { Actor, type CharacterClass, type CharacterInventoryItem, type CharacterStat } from "../actor/character";
import { Battle } from "../battle/battle";
import type { CampaignEvent, CampaignEventWithRound } from "../events/events";
import type { EquipmentSlotDefinition, ItemDefinition } from "../inventory/item";
import { Roleplayer } from "../roleplayer";
import type { World } from "../world/world";
import { CampaignState } from "./campaign-state";

export class CampaignEventDispatcher {
  world: World;
  roleplayer: Roleplayer;
  logger?: Logger;

  constructor(roleplayer: Roleplayer, world: World, logger?: Logger) {
    this.world = world;
    this.roleplayer = roleplayer;
    this.logger = logger;
  }

  startCampaign(campaignState: CampaignState) {
    if (campaignState.rounds.length > 0) {
      throw new Error("Campaign already started");
    }

    const campaignId = dangerousGenerateId();
    const campaignStartEvents: CampaignEventWithRound[] = [
      {
        id: dangerousGenerateId(),
        type: "CampaignStarted",
        roundId: "00000000-0000-0000-0000-000000000000",
        campaignId: campaignId,
        serialNumber: 0,
      },
      {
        type: "RoundStarted",
        campaignId: campaignId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 1,
      },
    ];

    this.roleplayer.publishEvent(campaignState.id, ...campaignStartEvents);
  }

  addCharacterItem(campaignState: CampaignState, characterId: Actor["id"], itemDefinitionId: ItemDefinition["id"]) {
    const actionGain: CampaignEvent = {
      characterId,
      itemDefinitionId: itemDefinitionId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemGain",
      itemInstanceId: dangerousGenerateId(),
    };

    this.roleplayer.publishEvent(campaignState.id, actionGain);
  }

  removeCharacterItem(
    campaignState: CampaignState,
    characterId: Actor["id"],
    characterInventoryItemId: CharacterInventoryItem["id"]
  ) {
    const actionGain: CampaignEvent = {
      characterId,
      characterInventoryItemId,
      id: dangerousGenerateId(),
      type: "CharacterInventoryItemLoss",
    };

    this.roleplayer.publishEvent(campaignState.id, actionGain);
  }

  addCharacterEquipmentSlot(
    campaignState: CampaignState,
    characterId: Actor["id"],
    equipmentSlotId: EquipmentSlotDefinition["id"]
  ) {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      id: dangerousGenerateId(),
      type: "CharacterEquipmentSlotGain",
    };

    this.roleplayer.publishEvent(campaignState.id, equipEvent);
  }

  characterUnEquipItem(
    campaignState: CampaignState,
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

    this.roleplayer.publishEvent(campaignState.id, equipEvent);
  }

  characterEquipItem(
    campaignState: CampaignState,
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

    this.roleplayer.publishEvent(campaignState.id, equipEvent);
  }

  addActionToCharacter(campaignState: CampaignState, characterId: Actor["id"], actionId: ActionDefinition["id"]) {
    const actionGain: CampaignEvent = {
      type: "CharacterActionGain",
      characterId,
      actionId,
      id: dangerousGenerateId(),
    };

    this.roleplayer.publishEvent(campaignState.id, actionGain);
  }

  setCharacterStats(campaignState: CampaignState, characterId: Actor["id"], stats: CharacterStat[]) {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
      id: dangerousGenerateId(),
    }));

    this.roleplayer.publishEvent(campaignState.id, ...statsEvents);
  }

  setCharacterClasses(campaignState: CampaignState, characterId: Actor["id"], classes: CharacterClass[]) {
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

    this.roleplayer.publishEvent(campaignState.id, ...[classResetEvent, ...classUpdates]);
  }

  setCharacterName(campaignState: CampaignState, characterId: Actor["id"], name: string) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterNameSet",
      characterId,
      id: dangerousGenerateId(),
      name,
    };

    this.roleplayer.publishEvent(campaignState.id, characterUpdate);
  }

  characterGainExperience(campaignState: CampaignState, characterId: Actor["id"], experience: number) {
    const characterUpdate: CampaignEvent = {
      type: "CharacterExperienceChanged",
      characterId,
      id: dangerousGenerateId(),
      experience,
    };

    this.roleplayer.publishEvent(campaignState.id, characterUpdate);
  }

  addCharacterToCurrentBattle(campaignState: CampaignState, characterId: Actor["id"]) {
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

    this.roleplayer.publishEvent(campaignState.id, ...characterBattleEnter);
  }

  spawnCharacterFromTemplate(campaignState: CampaignState, templateId: Actor["id"]) {
    const template = this.world.actorTemplates.find((c) => c.id === templateId);
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

    this.roleplayer.publishEvent(campaignState.id, ...events);

    return characterId;
  }

  createCharacter(campaignState: CampaignState, characterId: Actor["id"], name: string) {
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

    this.publishRoundEvent(campaignState, ...characterSpawnEvents);
  }

  nextRound(campaignState: CampaignState, battleId?: Battle["id"]) {
    const newRoundId = dangerousGenerateId();
    const events: CampaignEventWithRound[] = [
      {
        type: "RoundStarted",
        id: dangerousGenerateId(),
        roundId: newRoundId,
        battleId,
        serialNumber: this.roleplayer.nextSerialNumber(),
        campaignId: campaignState.id,
      },
    ];

    this.roleplayer.events.push(...events);

    return newRoundId;
  }

  endRound(campaignState: CampaignState) {
    const events: CampaignEvent[] = [
      {
        type: "RoundEnded",
        id: dangerousGenerateId(),
      },
    ];

    this.roleplayer.publishEvent(campaignState.id, ...events);
  }

  startBattle(campaignState: CampaignState) {
    const battleId = dangerousGenerateId();
    const currentRound = campaignState.getCurrentRound();

    this.roleplayer.events.push({
      type: "BattleStarted",
      id: dangerousGenerateId(),
      battleId,
      roundId: currentRound.id,
      serialNumber: this.roleplayer.nextSerialNumber(),
      campaignId: campaignState.id,
    });

    return battleId;
  }

  performCharacterAttack(campaignState: CampaignState, attacker: Actor, actionDef: ActionDefinition, targets: Actor[]) {
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

    return this.roleplayer.publishEvent(campaignState.id, ...characterResourceLoss, ...targetReceiveAttackEvents);
  }

  endCharacterTurn(campaignState: CampaignState, actor: Actor) {
    this.roleplayer.publishEvent(campaignState.id, {
      type: "CharacterEndTurn",
      id: dangerousGenerateId(),
      characterId: actor.id,
    });
  }

  publishRoundEvent(campaignState: CampaignState, ...newEvents: CampaignEvent[]) {
    const currentRound = campaignState.getCurrentRound();

    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      const eventSerialNumber = this.roleplayer.nextSerialNumber() + i;
      return {
        ...e,
        roundId: currentRound.id,
        serialNumber: eventSerialNumber,
        campaignId: campaignState.id,
      };
    });

    this.roleplayer.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  applyEvent(campaignState: CampaignState, event: CampaignEventWithRound) {
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

      case "CharacterSpawned": {
        const templateCharacter = this.world.actorTemplates.find((c) => c.id === event.templateCharacterId);
        const alreadySpawnedTemplateCharacters = campaignState.characters.filter(
          (c) => c.templateCharacterId === event.templateCharacterId
        );

        if (!templateCharacter) {
          campaignState.characters.push(new Actor({ id: event.characterId, world }));
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

      default:
        this.logger?.warn(`Unknown event type ${event.type}`);
    }
  }
}
