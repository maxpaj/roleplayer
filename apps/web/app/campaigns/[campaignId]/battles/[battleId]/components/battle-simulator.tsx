"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  Round,
  CampaignEvent,
  CampaignEventType,
  CampaignState,
  BattleEntity,
  Character,
  MonsterInstance,
} from "roleplayer";
import { D20, roll } from "roleplayer";
import { Interaction } from "roleplayer";
import { Campaign } from "roleplayer";
import { Id } from "roleplayer";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H3, Muted } from "@/components/ui/typography";
import { RemoveFunctions } from "types/without-functions";
import { AddBattleCharacterButton } from "./add-battle-character-button";
import { AddBattleMonsterButton } from "./add-battle-monster-button";
import { ActorRecord, BattleEntityRecord } from "models/actor";

const EventIconSize = 32;

type BattleSimulatorProps = {
  campaign: RemoveFunctions<Campaign>;
  battleId: Battle["id"];
  campaignActorRecords: BattleEntityRecord[];
};

export function BattleSimulator({
  campaign,
  battleId,
  campaignActorRecords,
}: BattleSimulatorProps) {
  const [tempCampaign, setTempCampaignReact] = useState<Campaign>(
    new Campaign(campaign)
  );
  const [tempCampaignState, setTempCampaignState] = useState<CampaignState>(
    tempCampaign.applyEvents()
  );
  const [, updateState] = useState({});
  const [selectedAction, setSelectedAction] = useState<Interaction | undefined>(
    undefined
  );
  const forceUpdate = useCallback(() => updateState({}), []);

  function setCampaign(campaign: Campaign) {
    setTempCampaignReact(campaign);
    setTempCampaignState(campaign.applyEvents());
    forceUpdate();
  }

  function addCharacter(characterId: Character["id"]) {
    tempCampaign.addCharacterToCurrentBattle(characterId);
    setCampaign(tempCampaign);
  }

  function addMonster(monsterId: MonsterInstance["id"]) {
    tempCampaign.addMonsterToCurrentBattle(monsterId);
    setCampaign(tempCampaign);
  }

  function characterAttack(
    attackerId: Id,
    defenderIds: Id[],
    action: Interaction
  ) {
    const attacker = tempCampaign.getCharacter(attackerId);

    if (!attacker.actions.length) {
      throw new Error("Has no attacks");
    }

    const defenders = defenderIds.map((defenderId) =>
      tempCampaign.getCharacter(defenderId)
    );

    const attack = attacker
      .getAvailableActions()
      .find((a) => a.id === action.id);

    if (!attack) {
      throw new Error("Cannot find attack");
    }

    defenders.forEach((defender) => {
      return tempCampaign.performCharacterAttack(
        attacker,
        roll(D20),
        attack,
        defender
      );
    });

    setCampaign(tempCampaign);
  }

  function renderCharacter(
    battle: Battle,
    battleCharacter: ActorRecord,
    currentRound: Round,
    characterToAct?: ActorRecord
  ) {
    const c = tempCampaign.applyEvents();

    const hasSpentAction = c.characterHasRoundEvent(
      currentRound,
      battleCharacter.id,
      "CharacterPrimaryAction"
    );

    const hasSpentBonus = c.characterHasRoundEvent(
      currentRound,
      battleCharacter.id,
      "CharacterSecondaryAction"
    );

    const hasFinished = c.characterHasRoundEvent(
      currentRound,
      battleCharacter.id,
      "CharacterEndRound"
    );

    const currentCharacterAction =
      battleCharacter.id === (characterToAct ? characterToAct.id : undefined);

    const currentActionClass = currentCharacterAction
      ? "shadow-[0_0px_40px_0px_rgba(0,0,0,0.3)] shadow-red-600"
      : "";

    return (
      <div
        key={battleCharacter.id}
        className={`flex justify-between border border-slate-700 w-full overflow-hidden shadow-md relative ${
          currentActionClass || ""
        }`}
      >
        <div className="w-full">
          {battleCharacter.renderPortrait()}

          <div className="flex justify-between w-full relative p-4">
            {currentCharacterAction && (
              <div className="flex gap-x-2">
                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) => {
                    const a = battleCharacter
                      .getAvailableActions()
                      .find((a) => a.name === e.target.value);
                    setSelectedAction(a);
                  }}
                >
                  <option>Select action</option>
                  {battleCharacter.getAvailableActions().map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) =>
                    battleCharacter.performAction(
                      [parseInt(e.target.value)],
                      selectedAction!.id
                    )
                  }
                >
                  <option>Select target</option>
                  {selectedAction &&
                    battleCharacter
                      .getEligibleTargets(selectedAction)
                      .map((target) => <option>{target.id}</option>)}
                </select>

                <Button
                  disabled={hasFinished}
                  onClick={() => {
                    tempCampaign.endCharacterTurn(battleCharacter);
                    setCampaign(tempCampaign);
                  }}
                >
                  End
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function getBattleEntityRecord(
    battleCharacter: BattleEntity
  ): BattleEntityRecord {
    const record = campaignActorRecords.find(
      (c) => c.actor.id === battleCharacter.actor.id
    );

    if (!record) {
      throw new Error("Battle entity record not found");
    }

    return record;
  }

  function getActorImageURL(battleCharacter: BattleEntity): string {
    return "https://image.jpg";
  }

  function getActor(battleCharacter: BattleEntity): ActorRecord {
    const battleEntityRecord = getBattleEntityRecord(battleCharacter);
    const battleEntityImageUrl = getActorImageURL(battleCharacter);

    return {
      ...battleEntityRecord.actor,
      renderPortrait: () => (
        <>
          {battleEntityRecord.actor.getType()}

          <div
            className="absolute w-full h-full z-0"
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
    const battleEvents = tempCampaign.getCurrentBattleEvents();

    return (
      <div className="w-full mb-4 gap-y-4 flex flex-col">
        {battleEvents.map(renderBattleEvent)}
      </div>
    );
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions: CampaignEventType["type"][] = [];
    return !excludedActions.includes(event.type);
  }

  function nextRound() {
    tempCampaign.nextRound(battleState?.id);
    setCampaign(tempCampaign);
  }

  function renderBattleEvent(event: CampaignEvent) {
    const eventIcon = EventIconMap[event.type];

    return (
      <div key={event.id} className="flex gap-2 border border-slate-500 p-2">
        <Image
          className="invert"
          width={EventIconSize}
          height={EventIconSize}
          alt={eventIcon.alt}
          src={eventIcon.icon}
        />
        {event.type}
      </div>
    );
  }

  const battleState = tempCampaignState.battles.find((b) => b.id === battleId);
  if (!battleState) {
    return <>Battle state not found</>;
  }

  const currentRound = tempCampaign.getCurrentRound();
  if (!currentRound) {
    return <>No active round</>;
  }

  const battleEvents = tempCampaign.getCurrentBattleEvents();
  const roundEvents = battleEvents.filter((e) => e.roundId === currentRound.id);
  const currentCharacter = battleState.currentActorTurn(roundEvents);
  const campaignState = tempCampaign.applyEvents();
  const canEndTurn = campaignState.allCharactersHaveActed(battleEvents);

  return (
    <div className="w-full">
      <div className="flex mb-4 gap-2">
        <AddBattleCharacterButton
          campaign={campaign}
          onAddCharacter={addCharacter}
        />
        <AddBattleMonsterButton campaign={campaign} onAddMonster={addMonster} />

        <Button
          disabled={!canEndTurn}
          onClick={() => {
            nextRound();
          }}
        >
          Next round
        </Button>
      </div>

      <div className="w-full flex gap-4">
        <div className="w-3/4">
          <H3>
            Round {battleEvents.filter((e) => e.type === "RoundStarted").length}
          </H3>

          {battleState.entities.length === 0 && (
            <Muted>No characters added to battle yet</Muted>
          )}

          {battleState.entities.length > 0 && (
            <div className="flex flex-col w-full gap-y-4 mb-4">
              {battleState.entities
                .sort((a, b) => b.initiative - a.initiative)
                .map((battleChar) => {
                  return renderCharacter(
                    battleState,
                    getActor(battleChar),
                    currentRound,
                    getActor(currentCharacter)
                  );
                })}
            </div>
          )}
        </div>

        <div className="w-1/4">
          <H3>Events ({battleEvents.length})</H3>
          {renderBattleEvents()}
        </div>
      </div>
    </div>
  );
}
