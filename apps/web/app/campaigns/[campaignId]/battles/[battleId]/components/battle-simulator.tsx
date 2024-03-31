"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  Round,
  CampaignEvent,
  Actor,
  Campaign,
  ActionDefinition,
  BattleActor,
  World,
  DnDRuleset,
  CampaignEventWithRound,
  RoleplayerEvent,
  isCharacterEvent,
} from "roleplayer";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H3, H4, H5, Muted } from "@/components/ui/typography";
import { AddBattleCharacterButton } from "./add-battle-character-button";
import { AddBattleMonsterButton } from "./add-battle-monster-button";
import { saveCampaignEvents } from "app/campaigns/actions";
import { DiceRollCard } from "./dice-roll-card";
import { Divider } from "@/components/ui/divider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WorldAggregated } from "services/world-service";
import { CampaignAggregated } from "services/campaign-service";
import { ActorEligibleActions } from "./battle-actor-eligible-actions";
import { ActorActionEligibleTargets } from "./battle-actor-eligible-targets";

const DEBUG = false;

const EventIconSize = 32;

type BattleSimulatorProps = {
  campaignData: CampaignAggregated;
  battleId: Battle["id"];
  worldData: WorldAggregated;
};

export function BattleSimulator({ campaignData, battleId, worldData }: BattleSimulatorProps) {
  const [tempCampaign, setTempCampaignReact] = useState<Campaign>(
    new Campaign({
      ...campaignData,
      world: new World(new DnDRuleset(), worldData.name, worldData as unknown as Partial<World>),
      events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
    })
  );

  const [, updateState] = useState({});
  const [selectedAction, setSelectedAction] = useState<ActionDefinition | undefined>(undefined);
  const forceUpdate = useCallback(() => updateState({}), []);
  const tempCampaignState = tempCampaign.getCampaignStateFromEvents();

  async function setCampaign(campaign: Campaign) {
    setTempCampaignReact(campaign);
    await saveCampaignEvents(campaign.id, campaign.events);
    forceUpdate();
  }

  function addCharacter(characterId: Actor["id"]) {
    const character = campaignState.characters.find((c) => c.id === characterId);
    if (!character) {
      throw new Error("Not such character");
    }

    tempCampaign.addCharacterToCurrentBattle(characterId);
    setCampaign(tempCampaign);
  }

  function addMonster(monsterId: Actor["id"]) {
    const monster = tempCampaign.world.characters.find((c) => c.id === monsterId);
    if (!monster) {
      throw new Error("Not such monster");
    }

    tempCampaign.createCharacter(monster.id, "Bandit");
    tempCampaign.addCharacterToCurrentBattle(monsterId);
    setCampaign(tempCampaign);
  }

  function renderEventMessage(event: CampaignEvent) {
    switch (event.type) {
      case "BattleStarted":
        return "Battle started";
      case "CharacterBattleEnter":
        return "Character entered battle";
    }
  }

  function renderCharacter(currentRound: Round, battleCharacter: BattleActor, isCharacterTurnToAct: boolean) {
    const hasFinished = tempCampaign.characterHasRoundEvent(currentRound, battleCharacter.actor, "CharacterEndRound");
    const currentCharacterActionClasses = isCharacterTurnToAct
      ? "shadow-[inset_0px_0px_30px_0px_rgba(0,0,0,0.25)] shadow-primary/40"
      : "";

    return (
      <div
        key={battleCharacter.actor.id}
        className={`relative flex w-full flex-col justify-between overflow-hidden border border-slate-700 ${currentCharacterActionClasses || ""}`}
      >
        <div className={`${isCharacterTurnToAct ? "" : "opacity-50"} w-full p-2`}>
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <H5>
                {battleCharacter.actor.name} {DEBUG && <>({battleCharacter.actor.id})</>}
              </H5>
              <Divider className="my-3" />
            </div>

            <DiceRollCard roll={battleCharacter.actingOrder} />
          </div>

          <H5>Resources remaining</H5>
          <div className="flex gap-2">
            {battleCharacter.actor.resources.map((r) => (
              <div key={r.resourceTypeId}>
                {r.amount}/{r.max}
              </div>
            ))}
          </div>

          {isCharacterTurnToAct && (
            <>
              <H5>Actions</H5>
              <div className="relative flex w-full flex-wrap justify-between p-4">
                {isCharacterTurnToAct && (
                  <div className="flex flex-wrap gap-2 ">
                    <ActorEligibleActions actor={battleCharacter.actor} onSelectedAction={setSelectedAction} />
                    <ActorActionEligibleTargets
                      campaign={tempCampaign}
                      action={selectedAction!}
                      actor={battleCharacter.actor}
                      onSelectedTargets={(targets) => {
                        tempCampaign.performCharacterAttack(battleCharacter.actor, selectedAction!, targets);
                        setCampaign(tempCampaign);
                      }}
                    />

                    <Button
                      disabled={hasFinished}
                      onClick={() => {
                        tempCampaign.endCharacterTurn(battleCharacter.actor);
                        setCampaign(tempCampaign);
                      }}
                    >
                      End round
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap p-2 text-sm">
          {tempCampaign.events
            .filter((e) => e.roundId === currentRound.id)
            .filter((e) => isCharacterEvent(e) && e.characterId === battleCharacter.actor.id)
            .map(renderEvent)}
        </div>
      </div>
    );
  }

  function getBattleEntityRecord(battleCharacter: BattleActor): Actor {
    const record = campaignActorRecords.find((char) => char.actor.id === battleCharacter.actor.id);

    if (!record) {
      throw new Error("Battle entity record not found");
    }

    return record.actor;
  }

  function getActorImageURL(battleCharacter: Actor): string {
    return "https://image.jpg";
  }

  function getActor(battleCharacter: BattleActor): {} {
    const battleEntityRecord = getBattleEntityRecord(battleCharacter);
    const battleEntityImageUrl = getActorImageURL(battleCharacter.actor);

    return {
      ...battleEntityRecord,
      renderPortrait: () => (
        <>
          {battleEntityRecord.characterType}

          <div
            className="absolute z-0 h-full w-full"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 1) 200px, rgba(0, 0, 0, 0) 150%), url(${battleEntityImageUrl})`,
              backgroundSize: `cover, cover`,
              backgroundPositionX: `0, 200px`,
              color: "#000",
            }}
          ></div>
        </>
      ),
    };
  }

  function renderBattleEvents() {
    const battleEvents = tempCampaign.events
      .filter((e) => e.battleId === battleId)
      .toSorted((a, b) => a.serialNumber - b.serialNumber);
    return <div className="mb-4 flex w-full flex-col gap-y-4">{battleEvents.map(renderEvent)}</div>;
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions: RoleplayerEvent["type"][] = [];
    return !excludedActions.includes(event.type);
  }

  function nextRound() {
    tempCampaign.nextRound(battleState?.id);
    setCampaign(tempCampaign);
    setSelectedAction(undefined);
  }

  function renderEvent(event: CampaignEvent) {
    const eventIcon = EventIconMap[event.type];

    return (
      <TooltipProvider key={event.id}>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex justify-between gap-2 border border-slate-500 p-2">
              <div className="flex gap-2">
                <Image
                  className="invert"
                  width={EventIconSize}
                  height={EventIconSize}
                  alt={eventIcon.alt}
                  src={eventIcon.icon}
                />
                {renderEventMessage(event)}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const battleState = tempCampaignState.battles.find((b) => b.id === battleId);
  if (!battleState) {
    return <>Battle state not found</>;
  }

  const campaignState = tempCampaign.getCampaignStateFromEvents();
  const currentRound = campaignState.getCurrentRound();

  if (!currentRound) {
    return <>No active round</>;
  }

  const battleEvents = tempCampaign.events.filter((e) => e.battleId === battleId);
  const roundEvents = battleEvents.filter((e) => e.roundId === currentRound.id);
  const currentCharacter = battleState.currentActorTurn(roundEvents);
  const canEndTurn = campaignState.allCharactersHaveActed(battleEvents);
  const battle = campaignState.battles.find((b) => b.id === battleId);

  if (!battle) {
    return <>Battle not found!</>;
  }

  const campaignActorRecords = battle.actors;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <AddBattleCharacterButton
          campaignId={tempCampaign.id}
          availableCharacters={campaignState.characters.filter((c) => c.characterType === "Player")}
          onAddCharacter={addCharacter}
        />

        <AddBattleMonsterButton
          worldId={tempCampaign.world.id}
          monsters={worldData.characters.filter((c) => c.characterType === "Monster")}
          onAddMonster={addMonster}
        />

        <Button
          disabled={!canEndTurn}
          onClick={() => {
            nextRound();
          }}
        >
          Next round
        </Button>
      </div>

      <H3>Round {battleEvents.filter((e) => e.type === "RoundStarted").length}</H3>

      {battleState.actors.length === 0 && <Muted>No characters added to battle yet</Muted>}

      {battleState.actors.length > 0 && (
        <div className="mb-4 flex w-full flex-col gap-3">
          {battleState.actors
            .toSorted((a, b) => b.actingOrder - a.actingOrder)
            .map((battleChar) =>
              renderCharacter(currentRound, battleChar, currentCharacter?.actor.id === battleChar.actor.id)
            )}
        </div>
      )}

      <H3>Events ({battleEvents.length})</H3>
      {renderBattleEvents()}
    </div>
  );
}
