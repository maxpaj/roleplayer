"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  Round,
  CampaignEvent,
  CampaignEventType,
  CampaignState,
  Character,
  MonsterInstance,
  BattleActor,
} from "roleplayer";
import { D20, roll } from "roleplayer";
import { Interaction } from "roleplayer";
import { Campaign } from "roleplayer";
import { Id } from "roleplayer";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H3, H5, Muted } from "@/components/ui/typography";
import { RemoveFunctions } from "types/without-functions";
import { AddBattleCharacterButton } from "./add-battle-character-button";
import { AddBattleMonsterButton } from "./add-battle-monster-button";
import { ActorRecord } from "models/actor";
import { saveCampaignEvents } from "app/campaigns/actions";
import { DiceRollCard } from "./dice-roll-card";
import { Separator } from "@/components/ui/separator";

const EventIconSize = 32;

type BattleSimulatorProps = {
  campaign: RemoveFunctions<Campaign>;
  battleId: Battle["id"];
};

export function BattleSimulator({ campaign, battleId }: BattleSimulatorProps) {
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

  async function setCampaign(campaign: Campaign) {
    setTempCampaignReact(campaign);
    setTempCampaignState(campaign.applyEvents());
    await saveCampaignEvents(campaign.id, campaign.events);
    forceUpdate();
  }

  function addCharacter(characterId: Character["id"]) {
    const character = campaignState.characters.find(
      (c) => c.id === characterId
    );
    if (!character) {
      throw new Error("Not such character");
    }

    tempCampaign.addCharacterToCurrentBattle(
      characterId,
      character.rollInitiative()
    );
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
    currentRound: Round,
    battleCharacter: BattleActor,
    isCharacterTurnToAct: boolean
  ) {
    const hasSpentAction = campaignState.characterHasRoundEvent(
      currentRound,
      battleCharacter.actor.id,
      "CharacterPrimaryAction"
    );

    const hasSpentBonus = campaignState.characterHasRoundEvent(
      currentRound,
      battleCharacter.actor.id,
      "CharacterSecondaryAction"
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
        className={`flex justify-between border border-slate-700 w-full overflow-hidden relative ${
          currentActionClass || ""
        }`}
      >
        <div className="w-full p-2">
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <H5>{battleCharacter.actor.name}</H5>
              <Separator className="my-3" />
            </div>

            <DiceRollCard roll={battleCharacter.initiative} />
          </div>

          <div className="flex justify-between w-full relative p-4">
            {isCharacterTurnToAct && (
              <div className="flex gap-x-2">
                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) => {
                    const a = battleCharacter.actor
                      .getAvailableActions()
                      .find((a) => a.name === e.target.value);
                    setSelectedAction(a);
                  }}
                >
                  <option>Select action</option>
                  {battleCharacter.actor.getAvailableActions().map((char) => (
                    <option key={char.name}>{char.name}</option>
                  ))}
                </select>

                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) =>
                    battleCharacter.actor.performAction(
                      [e.target.value],
                      selectedAction!.id
                    )
                  }
                >
                  <option>Select target</option>
                  {selectedAction &&
                    battleCharacter.actor
                      .getEligibleTargets(selectedAction)
                      .map((target) => <option>{target.id}</option>)}
                </select>

                <Button
                  disabled={hasFinished}
                  onClick={() => {
                    tempCampaign.endCharacterTurn(battleCharacter.actor);
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

  function getBattleEntityRecord(battleCharacter: BattleActor): BattleActor {
    const record = campaignActorRecords.find(
      (char) => char.actor.id === battleCharacter.actor.id
    );

    if (!record) {
      throw new Error("Battle entity record not found");
    }

    return new BattleActor(record.actor, record.initiative);
  }

  function getActorImageURL(battleCharacter: BattleActor): string {
    return "https://image.jpg";
  }

  function getActor(battleCharacter: BattleActor): ActorRecord {
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

  const campaignState = tempCampaign.applyEvents();
  const battleEvents = tempCampaign.getCurrentBattleEvents();
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
      <div className="flex mb-4 gap-2">
        <AddBattleCharacterButton
          availableCharacters={campaignState.characters}
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

      <H3>
        Round {battleEvents.filter((e) => e.type === "RoundStarted").length}
      </H3>

      {battleState.entities.length === 0 && (
        <Muted>No characters added to battle yet</Muted>
      )}

      {battleState.entities.length > 0 && (
        <div className="flex flex-col w-full gap-3 mb-4">
          {battleState.entities
            .sort((a, b) => b.initiative - a.initiative)
            .map((battleChar) =>
              renderCharacter(
                currentRound,
                battleChar,
                currentCharacter.actor.id === battleChar.actor.id
              )
            )}
        </div>
      )}

      <H3>Events ({battleEvents.length})</H3>
      {renderBattleEvents()}
    </div>
  );
}
