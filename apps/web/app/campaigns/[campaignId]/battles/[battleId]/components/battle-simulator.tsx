"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  Round,
  CampaignEvent,
  CampaignState,
  Actor,
  Campaign,
  Id,
  ActionDefinition,
  BattleActor,
  World,
  DnDRuleset,
  CampaignEventWithRound,
  RoleplayerEvent,
} from "roleplayer";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H3, H5, Muted } from "@/components/ui/typography";
import { AddBattleCharacterButton } from "./add-battle-character-button";
import { AddBattleMonsterButton } from "./add-battle-monster-button";
import { saveCampaignEvents } from "app/campaigns/actions";
import { DiceRollCard } from "./dice-roll-card";
import { Divider } from "@/components/ui/divider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WorldAggregated } from "services/world-service";
import { CampaignAggregated } from "services/campaign-service";

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
  const [tempCampaignState, setTempCampaignState] = useState<CampaignState>(tempCampaign.getCampaignStateFromEvents());
  const [, updateState] = useState({});
  const [selectedAction, setSelectedAction] = useState<ActionDefinition | undefined>(undefined);
  const forceUpdate = useCallback(() => updateState({}), []);

  async function setCampaign(campaign: Campaign) {
    setTempCampaignReact(campaign);
    setTempCampaignState(campaign.getCampaignStateFromEvents());
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
    tempCampaign.addCharacterToCurrentBattle(monsterId);
    setCampaign(tempCampaign);
  }

  function characterAttack(attackerId: Id, defenderIds: Id[], action: ActionDefinition) {
    const attacker = tempCampaignState.getCharacter(attackerId);

    if (!attacker.actions.length) {
      throw new Error("Has no attacks");
    }

    const defenders = defenderIds.map((defenderId) => tempCampaignState.getCharacter(defenderId));

    const attack = attacker.getAvailableActions().find((a) => a.id === action.id);

    if (!attack) {
      throw new Error("Cannot find attack");
    }

    tempCampaign.performCharacterAttack(attacker, attack, defenders);

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
    const hasSpentPrimaryAction = !campaignState.characterHasResource(
      currentRound,
      battleCharacter.actor.id,
      "Primary action"
    );
    const hasSpentBonusAction = !campaignState.characterHasResource(
      currentRound,
      battleCharacter.actor.id,
      "Primary action"
    );
    const hasFinished = campaignState.characterHasRoundEvent(
      currentRound,
      battleCharacter.actor.id,
      "CharacterEndRound"
    );
    const currentActionClass = isCharacterTurnToAct
      ? "shadow-[inset_0px_0px_30px_0px_rgba(0,0,0,0.25)] shadow-primary/40"
      : "";

    return (
      <div
        key={battleCharacter.actor.id}
        className={`relative flex w-full justify-between overflow-hidden border border-slate-700 ${currentActionClass || ""}`}
      >
        <div className="w-full p-2">
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <H5>
                {battleCharacter.actor.name} ({battleCharacter.actor.type})
              </H5>
              <Divider className="my-3" />
            </div>

            <DiceRollCard roll={battleCharacter.actingOrder} />
          </div>

          <div className="relative flex w-full flex-wrap justify-between p-4">
            {isCharacterTurnToAct && (
              <div className="flex flex-wrap gap-2 ">
                <Select disabled={hasSpentPrimaryAction || hasFinished}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {battleCharacter.actor.getAvailableActions().map((action) => (
                      <SelectItem
                        key={action.name}
                        value={action.id}
                        onClick={() => {
                          setSelectedAction(action);
                        }}
                      >
                        {action.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select disabled={hasSpentPrimaryAction || hasFinished}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedAction &&
                      battleCharacter.actor.getEligibleTargets(selectedAction).map((target) => (
                        <SelectItem
                          onClick={() =>
                            tempCampaign.performCharacterAttack(battleCharacter.actor, selectedAction, [target])
                          }
                          value={target.id}
                        >
                          {target.id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

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
          {battleEntityRecord.type}

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
      .sort((a, b) => a.serialNumber - b.serialNumber);
    return <div className="mb-4 flex w-full flex-col gap-y-4">{battleEvents.map(renderBattleEvent)}</div>;
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions: RoleplayerEvent["type"][] = [];
    return !excludedActions.includes(event.type);
  }

  function nextRound() {
    tempCampaign.nextRound(battleState?.id);
    setCampaign(tempCampaign);
  }

  function renderBattleEvent(event: CampaignEvent) {
    const eventIcon = EventIconMap[event.type];

    return (
      <div key={event.id} className="flex justify-between gap-2 border border-slate-500 p-2">
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle />
            </TooltipTrigger>
            <TooltipContent>
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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

  const campaignActorRecords = battle.entities;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <AddBattleCharacterButton
          campaignId={tempCampaign.id}
          availableCharacters={campaignState.characters}
          onAddCharacter={addCharacter}
        />
        <AddBattleMonsterButton
          worldId={tempCampaign.world.id}
          monsters={worldData.monsters}
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

      {battleState.entities.length === 0 && <Muted>No characters added to battle yet</Muted>}

      {battleState.entities.length > 0 && (
        <div className="mb-4 flex w-full flex-col gap-3">
          {battleState.entities
            .sort((a, b) => b.actingOrder - a.actingOrder)
            .map((battleChar) =>
              renderCharacter(currentRound, battleChar, currentCharacter.actor.id === battleChar.actor.id)
            )}
        </div>
      )}

      <H3>Events ({battleEvents.length})</H3>
      {renderBattleEvents()}
    </div>
  );
}
