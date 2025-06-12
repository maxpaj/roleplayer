import {
  Actor,
  CampaignState,
  CharacterEventTypes,
  generateId,
  isBattleEvent,
  SystemEventType,
  type CampaignEvent,
  type RoleplayerEvent,
  type Ruleset,
} from "..";
import Observable from "../lib/events/observable";
import type { Logger } from "../lib/logging/logger";
import type { WithRequired } from "../types/with-required";
import type { ActionDispatch } from "./actions";

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
  events: RoleplayerEvent[] = [];
  campaign: CampaignState;
  logger?: Logger;

  constructor(
    config: WithRequired<Partial<Roleplayer>, "ruleset">,
    initialCampaignConfig: RoleplayerCampaignParameters
  ) {
    super();
    Object.assign(this, config);
    this.subscribe(this.reduce.bind(this));

    this.campaign = new CampaignState({
      ...initialCampaignConfig,
      roleplayer: this,
      ruleset: config.ruleset,
    });
  }

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  nextSerialNumber() {
    const sortedEvents = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);
    const lastSerialNumber = sortedEvents[sortedEvents.length - 1]?.serialNumber ?? 0;
    return lastSerialNumber + 1;
  }

  dispatchAction<T>(action: ActionDispatch<T>) {
    return action(this.dispatchEvents.bind(this), () => this);
  }

  dispatchEvents(...events: CampaignEvent[]) {
    for (const event of events) {
      this.dispatch(event);
    }
  }

  dispatch(event: CampaignEvent) {
    const eventSerialNumber = this.nextSerialNumber();
    const currentRoundId =
      event.type === SystemEventType.RoundStarted ? event.roundId : this.campaign.getCurrentRound().id;
    let roleplayerEvent: RoleplayerEvent;
    // TODO: Extract this to some middleware?
    if (isBattleEvent(event)) {
      roleplayerEvent = {
        ...event,
        id: generateId(),
        battleId: event.battleId,
        roundId: currentRoundId,
        serialNumber: eventSerialNumber,
      };
    } else {
      const currentBattleId = this.campaign.getCurrentBattle()?.id;
      roleplayerEvent = {
        ...event,
        id: generateId(),
        battleId: currentBattleId,
        roundId: currentRoundId,
        serialNumber: eventSerialNumber,
      };
    }
    this.events.push(roleplayerEvent);
    this.notify(roleplayerEvent);
  }

  reduce(event: RoleplayerEvent) {
    switch (event.type) {
      case SystemEventType.CampaignStarted: {
        if (this.campaign.started) {
          throw new Error("Campaign already started");
        }

        this.campaign.started = true;
        break;
      }

      case SystemEventType.RoundStarted: {
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

      case CharacterEventTypes.CharacterSpawned: {
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

      case CharacterEventTypes.CharacterDespawn: {
        const characterIndex = this.campaign.characters.findIndex((c) => c.id === event.characterId);
        if (characterIndex === -1) throw new Error(`Could not find character with id: ${event.characterId}`);
        const [removedCharacter] = this.campaign.characters.splice(characterIndex, 1);
        for (const battle of this.campaign.battles) {
          battle.actors = battle.actors.filter((actor) => actor.id !== event.characterId);
        }
        removedCharacter?.dispose();
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
