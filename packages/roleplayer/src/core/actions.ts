import { generateId } from "../lib/generate-id";
import type { ActionDefinition } from "./action/action";
import { mapEffect } from "./action/effect";
import type { Actor, CharacterClass, CharacterInventoryItem, CharacterStat } from "./actor/character";
import type { Battle } from "./battle/battle";
import type { CampaignEvent } from "./events/events";
import type { EquipmentSlotDefinition, ItemDefinition } from "./inventory/item";
import type { Roleplayer } from "./roleplayer";

type Dispatcher = (...events: CampaignEvent[]) => void;
type StateGetter = () => Roleplayer;

export type ActionDispatch<T = void> = (dispatch: Dispatcher, getState: StateGetter) => T;

export function startCampaign() {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    if (getState().campaign.rounds.length > 0) {
      console.warn("Campaign already started");
      return;
    }

    const campaignStartEvents: CampaignEvent[] = [
      {
        type: "CampaignStarted",
      },
      {
        type: "RoundStarted",
        roundId: generateId(),
      },
    ];

    dispatch(...campaignStartEvents);
  };
}

export function addCharacterItem(characterId: Actor["id"], itemDefinitionId: ItemDefinition["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const actionGain: CampaignEvent = {
      characterId,
      itemDefinitionId: itemDefinitionId,
      type: "CharacterInventoryItemGain",
      itemInstanceId: generateId(),
    };

    dispatch(actionGain);
  };
}

export function removeCharacterItem(characterId: Actor["id"], characterInventoryItemId: CharacterInventoryItem["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const actionGain: CampaignEvent = {
      characterId,
      characterInventoryItemId,
      type: "CharacterInventoryItemLoss",
    };

    dispatch(actionGain);
  };
}

export function addCharacterEquipmentSlot(characterId: Actor["id"], equipmentSlotId: EquipmentSlotDefinition["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      type: "CharacterEquipmentSlotGain",
    };

    dispatch(equipEvent);
  };
}

export function characterUnEquipItem(
  characterId: Actor["id"],
  equipmentSlotId: EquipmentSlotDefinition["id"],
  itemId?: ItemDefinition["id"]
) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const equipEvent: CampaignEvent = {
      characterId,
      equipmentSlotId,
      itemId,
      type: "CharacterInventoryItemUnEquip",
    };

    dispatch(equipEvent);
  };
}

export function characterEquipItem(
  characterId: Actor["id"],
  equipmentSlotId: EquipmentSlotDefinition["id"],
  itemId: ItemDefinition["id"]
) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const equipEvent: CampaignEvent = {
      type: "CharacterInventoryItemEquip",
      characterId,
      itemId,
      equipmentSlotId,
    };

    dispatch(equipEvent);
  };
}

export function addActionToCharacter(characterId: Actor["id"], actionId: ActionDefinition["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const actionGain: CampaignEvent = {
      type: "CharacterActionGain",
      characterId,
      actionId,
    };

    dispatch(actionGain);
  };
}

export function setCharacterStats(characterId: Actor["id"], stats: CharacterStat[]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const statsEvents: CampaignEvent[] = stats.map((st) => ({
      type: "CharacterStatChange",
      amount: st.amount,
      characterId,
      statId: st.statId,
    }));

    dispatch(...statsEvents);
  };
}

export function setCharacterClasses(characterId: Actor["id"], classes: CharacterClass[]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const classResetEvent: CampaignEvent = {
      type: "CharacterClassReset",
      characterId,
    };

    const classUpdates: CampaignEvent[] = classes.map((c) => ({
      type: "CharacterClassLevelGain",
      characterId,
      classId: c.classId,
    }));

    dispatch(...[classResetEvent, ...classUpdates]);
  };
}

export function setCharacterName(characterId: Actor["id"], name: string) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterUpdate: CampaignEvent = {
      type: "CharacterNameSet",
      characterId,
      name,
    };

    dispatch(characterUpdate);
  };
}

export function characterGainExperience(characterId: Actor["id"], experience: number) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterUpdate: CampaignEvent = {
      type: "CharacterExperienceChanged",
      characterId,
      experience,
    };

    dispatch(characterUpdate);
  };
}

export function addCharacterToCurrentBattle(characterId: Actor["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const actor = getState().campaign.characters.find((c) => c.id === characterId);
    if (!actor) {
      throw new Error("Actor not found");
    }

    const currentBattle = getState().campaign.getCurrentBattle();
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

    dispatch(...characterBattleEnter);
  };
}

export function spawnCharacterFromTemplate(templateId: Actor["id"]) {
  const action: ActionDispatch<Actor["id"]> = (dispatch: Dispatcher, getState: StateGetter) => {
    const template = getState().campaign.actorTemplates.find((c) => c.id === templateId);
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

    dispatch(...characterSpawnEvents);

    return characterId;
  };

  return action;
}

export function dispatchCharacterDespawnEvent(actorId: Actor["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterDespawnEvent = {
      type: "CharacterDespawn" as const,
      characterId: actorId,
    } satisfies CampaignEvent;

    dispatch(characterDespawnEvent);
  };
}

export function dispatchCharacterBattleEnterEvent(actorId: Actor["id"], battleId: Battle["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterBattleEnter = {
      type: "CharacterBattleEnter" as const,
      characterId: actorId,
      battleId,
    } satisfies CampaignEvent;

    dispatch(characterBattleEnter);
  };
}

export function dispatchCharacterBattleLeaveEvent(actorId: Actor["id"], battleId: Battle["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterBattleLeave = {
      type: "CharacterBattleLeave" as const,
      characterId: actorId,
      battleId,
    } satisfies CampaignEvent;

    dispatch(characterBattleLeave);
  };
}

export function createCharacter(characterId: Actor["id"], name: string) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const defaultResourcesEvents: CampaignEvent[] = getState()
      .ruleset.getCharacterResourceTypes()
      .map((cr) => ({
        type: "CharacterResourceMaxSet",
        max: cr.defaultMax || 0,
        characterId,
        resourceTypeId: cr.id,
      }));

    const resourcesGainEvents: CampaignEvent[] = getState()
      .ruleset.getCharacterResourceTypes()
      .map((cr) => ({
        type: "CharacterResourceGain",
        amount: cr.defaultMax || 0,
        characterId,
        resourceTypeId: cr.id,
      }));

    const defaultStatsEvents: CampaignEvent[] = getState()
      .ruleset.getCharacterStatTypes()
      .map((st) => ({
        type: "CharacterStatChange",
        amount: 0,
        characterId,
        statId: st.id,
      }));

    const defaultEquipmentSlotEvents: CampaignEvent[] = getState()
      .ruleset.getCharacterEquipmentSlots()
      .map((es) => ({
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

    dispatch(...characterSpawnEvents);
  };
}

export function nextRound(battleId?: Battle["id"]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const newRoundId = generateId();
    const events: CampaignEvent[] = [
      {
        type: "RoundStarted",
        roundId: newRoundId,
        battleId,
      },
    ];

    dispatch(...events);

    return newRoundId;
  };
}

export function endRound() {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const events: CampaignEvent[] = [
      {
        type: "RoundEnded",
      },
    ];

    dispatch(...events);
  };
}

export function startBattle() {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    dispatch({
      type: "BattleStarted",
      battleId: generateId(),
    });
  };
}

export function endBattle(battleId: string) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    dispatch({
      type: "BattleEnded",
      battleId,
    });
  };
}

export function performCharacterAttack(attacker: Actor, actionDef: ActionDefinition, targets: Actor[]) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const characterAction = attacker.action(actionDef);

    const characterActionHitRoll = characterAction.rolls.find((r) => r.name === "Hit");
    if (!characterActionHitRoll) {
      throw new Error("Hit roll not defined for character action");
    }

    const healthResource = getState()
      .ruleset.getCharacterResourceTypes()
      .find((rt) => rt.name === "Health");
    if (!healthResource) {
      throw new Error("Health resource not defined in world, cannot perform attack");
    }

    const targetReceiveAttackEvents = targets.flatMap((target) => {
      if (attacker.tryHit(target)) {
        return actionDef.appliesEffects.map((effect) =>
          mapEffect(effect, actionDef, attacker, target, getState().ruleset)
        );
      }

      return [];
    });

    const characterResourceLoss: CampaignEvent[] = actionDef.requiresResources.map((rr) => ({
      type: "CharacterResourceLoss",
      characterId: attacker.id,
      resourceTypeId: rr.resourceTypeId,
      amount: rr.amount,
    }));

    return dispatch(...characterResourceLoss, ...targetReceiveAttackEvents);
  };
}

export function endCharacterTurn(actor: Actor) {
  return (dispatch: Dispatcher, getState: StateGetter) => {
    const currentBattle = getState().campaign.getCurrentBattle();
    if (!currentBattle) {
      throw new Error("No current battle");
    }
    dispatch({
      type: "CharacterEndTurn",
      characterId: actor.id,
      battleId: currentBattle.id,
    });
  };
}
