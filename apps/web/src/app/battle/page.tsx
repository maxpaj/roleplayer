"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Id, generateId } from "../../../../../packages/dnd/core/id";
import {
  Battle,
  BattleCharacter,
  Round, 
} from "../../../../../packages/dnd/core/battle/battle";
import {
  Campaign,
  CampaignEvent,
  CampaignEventType,
} from "../../../../../packages/dnd/core/campaign/campaign";
import { D20, roll } from "../../../../../packages/dnd/core/dice/dice";
import { ItemSlot, ItemType } from "../../../../../packages/dnd/core/item/item";
import { ActionType } from "../../../../../packages/dnd/core/character/character";
import { ActionIconMap, EventIconMap } from "../dnd-theme";

const EventIconSize = 32;

export default function BattlePage() {
  const [campaign, setCampaignReact] = useState<Campaign>(
    new Campaign(
      [
        {
          id: generateId("item"),
          interactions: [],
          slot: ItemSlot.MainHand,
          name: "Short sword",
          type: ItemType.Equipment,
        },
      ],
      [],
      [new Battle([], [{ id: generateId("round") }])],
      []
    )
  );
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  function addCharacter(isPlayer: boolean) {
    const char = campaign.addRandomCharacterToCampaign(
      "Character name",
      isPlayer
    );
    const battle = campaign.getCurrentBattle();
    battle.addCharacterToCurrentBattle(char);
    setCampaign(campaign);
  }

  function setCampaign(campaign: Campaign) {
    setCampaignReact(campaign);
    forceUpdate();
  }

  function characterAttack(attackerId: Id, defenderIds: Id[]) {
    const attacker = campaign.getCharacter(attackerId);

    if (!attacker.baseAttacks.length) {
      throw new Error("Has no attacks");
    }

    const defenders = defenderIds.map((defenderId) =>
      campaign.getCharacter(defenderId)
    );

    const attack = attacker.baseAttacks[0];

    defenders.forEach((defender) => {
      return campaign.performCharacterAttack(
        attacker,
        roll(D20),
        attack.appliesEffects,
        defender
      );
    });

    setCampaign(campaign);
  }

  function renderCharacter(
    battleCharacter: BattleCharacter,
    currentRound: Round,
    characterToAct: BattleCharacter,
    battle: Battle
  ) {
    const { characterId } = battleCharacter;
    const character = campaign.getCharacter(characterId);
    const hasSpentAction = campaign.characterHasRoundEvent(
      currentRound,
      characterId,
      CampaignEventType.CharacterPrimaryAction
    );

    const hasSpentBonus = campaign.characterHasRoundEvent(
      currentRound,
      characterId,
      CampaignEventType.CharacterSecondaryAction
    );

    const hasFinished = campaign.characterHasRoundEvent(
      currentRound,
      characterId,
      CampaignEventType.CharacterEndRound
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
              <div>{character.race}</div>
              <div>
                {character.temporaryHealth} temporary +{" "}
                {character.currentHealth}/{character.maximumHealth} hp
              </div>
              <div>{battleCharacter.initiative} initiative</div>
              <div>
                Level {character.characterClasses[0].level}{" "}
                {character.characterClasses[0].clazz.name}
              </div>
            </div>

            {currentCharacterAction && (
              <div className="flex gap-x-2">
                <select
                  disabled={hasSpentAction || hasFinished}
                  className="border bg-transparent"
                  onChange={(e) =>
                    characterAttack(battleCharacter.characterId, [
                      e.target.value,
                    ])
                  }
                  placeholder="Attack"
                >
                  <option>Select target</option>
                  {battle.characters
                    .filter((c) => c.characterId != character.id)
                    .map((c) => (
                      <option key={c.characterId}>{c.characterId}</option>
                    ))}
                </select>

                <button
                  disabled={hasFinished}
                  onClick={() => {
                    campaign.characterPerformBattleAction(
                      ActionType.None,
                      CampaignEventType.CharacterEndRound,
                      character.id
                    );
                    setCampaign(campaign);
                  }}
                  className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
                >
                  End
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderBattleEvents() {
    const battle = campaign.getCurrentBattle();
    const battleEvents = campaign.getBattleEvents(battle);

    return (
      <div className="w-full gap-2 mb-4 flex flex-col">
        {battleEvents.filter(isVisibleEvent).map(renderBattleEvent)}
      </div>
    );
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions = [ActionType.None];
    return !excludedActions.includes(event.actionType);
  }

  function renderBattleEvent(event: CampaignEvent) {
    const eventIcon = EventIconMap[event.eventType];
    const actionIcon = ActionIconMap[event.actionType];

    return (
      <div key={event.id} className="flex border border-slate-500 p-2">
        <Image
          className="invert"
          width={EventIconSize}
          height={EventIconSize}
          alt={actionIcon.alt}
          src={actionIcon.icon}
        />

        <Image
          className="invert"
          width={EventIconSize / 2}
          height={EventIconSize / 2}
          alt={eventIcon.alt}
          src={eventIcon.icon}
        />

        {event.eventType}, {event.actionType}, {event.targetId}
      </div>
    );
  }

  const battle = campaign.getCurrentBattle();
  const battleEvents = campaign.getBattleEvents(battle);
  const currentRound = campaign.getCurrentRound();
  const currentCharacter = battle.currentCharacterTurn(
    battleEvents.filter((e) => e.roundId === currentRound.id)
  );
  const canEndTurn = battle.currentRoundCanEnd(battleEvents);

  function nextRound() {
    battle.nextRound();
    setCampaign(campaign);
  }

  return (
    <div className="w-full">
      <div className="flex mb-4 justify-between">
        <div className="flex gap-x-2">
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => addCharacter(true)}
          >
            Add character
          </button>

          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => addCharacter(false)}
          >
            Add monster
          </button>
        </div>
      </div>

      <h1 className="text-xl mb-4">Round {battle.rounds.length}</h1>
      <div className="w-full flex gap-4">
        <div className="w-3/4">
          <div className="flex flex-col w-full gap-y-4 mb-4">
            {battle.characters
              .sort((a, b) => b.initiative - a.initiative)
              .map((battleChar) =>
                renderCharacter(
                  battleChar,
                  currentRound,
                  currentCharacter,
                  battle
                )
              )}
          </div>

          <button
            className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
            disabled={!canEndTurn}
            onClick={() => {
              nextRound();
            }}
          >
            Next round
          </button>
        </div>

        <div className="w-1/4">
          <h1>Events ({campaign.events.length})</h1>
          {renderBattleEvents()}
        </div>
      </div>
    </div>
  );
}
