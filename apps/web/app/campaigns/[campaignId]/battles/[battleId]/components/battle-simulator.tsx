"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  BattleCharacter,
  Round,
  CampaignEvent,
  CampaignEventType,
} from "@repo/rp-lib";
import { D20, roll } from "@repo/rp-lib";
import { Interaction } from "@repo/rp-lib";
import { Campaign } from "@repo/rp-lib";
import { Id } from "@repo/rp-lib";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H3, Muted } from "@/components/ui/typography";
import { RemoveFunctions } from "types/without-functions";
import { AddBattleCharacterButton } from "./add-battle-character-button";
import { AddBattleMonsterButton } from "./add-battle-monster-button";

const EventIconSize = 32;

export function BattleSimulator({
  campaign,
}: {
  campaign: RemoveFunctions<Campaign>;
}) {
  const [tempCampaign, setTempCampaignReact] = useState<Campaign>(
    new Campaign(campaign)
  );
  const [, updateState] = useState({});
  const [selectedAction, setSelectedAction] = useState<Interaction | undefined>(
    undefined
  );
  const forceUpdate = useCallback(() => updateState({}), []);

  function addCharacter(characterId: string) {
    tempCampaign.addCharacterToCurrentBattle(characterId);
    setCampaign(tempCampaign);
  }

  function addMonster(monsterId: string) {
    tempCampaign.addMonsterToCurrentBattle(monsterId);
    setCampaign(tempCampaign);
  }

  function setCampaign(campaign: Campaign) {
    setTempCampaignReact(campaign);
    forceUpdate();
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
    battleCharacter: BattleCharacter,
    currentRound: Round,
    characterToAct?: BattleCharacter
  ) {
    const { characterId } = battleCharacter;
    const c = tempCampaign.applyEvents();
    const character = c.characters.find((c) => c.id === characterId);

    if (!character) {
      throw new Error("Character not found");
    }

    const hasSpentAction = c.characterHasRoundEvent(
      currentRound,
      character.id,
      "CharacterPrimaryAction"
    );

    const hasSpentBonus = c.characterHasRoundEvent(
      currentRound,
      character.id,
      "CharacterSecondaryAction"
    );

    const hasFinished = c.characterHasRoundEvent(
      currentRound,
      character.id,
      "CharacterEndRound"
    );

    const currentCharacterAction =
      battleCharacter.characterId ===
      (characterToAct ? characterToAct.characterId : undefined);

    const currentActionClass = currentCharacterAction
      ? "shadow-[0_0px_40px_0px_rgba(0,0,0,0.3)] shadow-red-600"
      : "";

    return (
      <div
        key={characterId}
        className={`flex justify-between border border-slate-700 w-full overflow-hidden shadow-md relative ${
          currentActionClass || ""
        }`}
      >
        <div className="w-full">
          <div
            className="absolute w-full h-full z-0"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 1) 200px, rgba(0, 0, 0, 0) 150%), url(${character.imageUrl})`,
              backgroundSize: `cover, cover`,
              backgroundPositionX: `0, 200px`,
              color: "#000",
            }}
          ></div>

          <div className="flex justify-between w-full relative p-4">
            <div>
              <div>{character.name}</div>
              <div>{character.race.name}</div>
              <div>
                {character.currentHealth}/{character.maximumHealth} hp (+
                {character.temporaryHealth} temporary)
              </div>
              <div>{battleCharacter.initiative} initiative</div>
              <div>Level {tempCampaign.getCharacterLevel(character)}</div>
            </div>

            {currentCharacterAction && (
              <div className="flex gap-x-2">
                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) => {
                    const a = character
                      .getAvailableActions()
                      .find((a) => a.name === e.target.value);
                    setSelectedAction(a);
                  }}
                >
                  <option>Select action</option>
                  {character.getAvailableActions().map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) =>
                    characterAttack(
                      battleCharacter.characterId,
                      [e.target.value],
                      selectedAction!
                    )
                  }
                >
                  <option>Select target</option>
                  {battle.characters
                    .filter((c) => c.characterId != character.id)
                    .map((c) => (
                      <option key={c.characterId}>{c.characterId}</option>
                    ))}
                </select>

                <Button
                  disabled={hasFinished}
                  onClick={() => {
                    tempCampaign.endCharacterTurn(character);
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

  function renderBattleEvents() {
    const battleEvents = tempCampaign.getCurrentBattleEvents();

    return (
      <div className="w-full mb-4 gap-y-4 flex flex-col">
        {battleEvents.filter(isVisibleEvent).map(renderBattleEvent)}
      </div>
    );
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions: CampaignEventType["type"][] = [];
    return !excludedActions.includes(event.type);
  }

  function nextRound() {
    tempCampaign.nextRound();
    setCampaign(tempCampaign);
  }

  function renderBattleEvent(event: CampaignEvent) {
    const eventIcon = EventIconMap[event.type];

    return (
      <div key={event.id} className="flex border border-slate-500 p-2">
        <Image
          className="invert"
          width={EventIconSize}
          height={EventIconSize}
          alt={eventIcon.alt}
          src={eventIcon.icon}
        />
      </div>
    );
  }

  const battle = tempCampaign.getCurrentBattle();
  if (battle === undefined) {
    return <>No active battle</>;
  }

  const currentRound = tempCampaign.getCurrentRound();
  if (currentRound === undefined) {
    return <>No active round</>;
  }

  const battleEvents = tempCampaign.getCurrentBattleEvents();
  const roundEvents = battleEvents.filter((e) => e.roundId === currentRound.id);
  const currentCharacter = battle.currentCharacterTurn(roundEvents);
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
          <H3>Round</H3>
          {battle.characters.length === 0 && (
            <Muted>No characters added to battle yet</Muted>
          )}

          {battle.characters.length > 0 && (
            <div className="flex flex-col w-full gap-y-4 mb-4">
              {battle.characters
                .sort((a, b) => b.initiative - a.initiative)
                .map((battleChar) =>
                  renderCharacter(
                    battle,
                    battleChar,
                    currentRound,
                    currentCharacter
                  )
                )}
            </div>
          )}
        </div>

        <div className="w-1/4">
          <H3>Events ({tempCampaign.events.length})</H3>
          {renderBattleEvents()}
        </div>
      </div>
    </div>
  );
}
