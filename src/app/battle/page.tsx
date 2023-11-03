"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Battle,
  BattleCharacter,
  Round,
  addCharacterToCurrentBattle,
  characterHasRoundEvent,
  currentRoundCanEnd,
  getBattleEvents,
  getCurrentBattleNextRound,
  getCurrentBattle,
  getCurrentRound as getCurrentBattleRound,
} from "@/lib/dnd/battle/battle";
import {
  ActionType,
  Campaign,
  CampaignEvent,
  CampaignEventType,
  addRandomCharacterToCampaign,
  getCharacter,
} from "@/lib/dnd/campaign/campaign";
import {
  characterPerformBattleAction,
  currentCharacterTurn,
} from "@/lib/dnd/battle/battle";

import moveIcon from "@/assets/icons/lorc/boot-prints.svg";
import defaultIcon from "@/assets/logo.svg";

import newRoundIcon from "@/assets/icons/lorc/time-trap.svg";
import primaryActionIcon from "@/assets/icons/skoll/rank-1.svg";
import secondaryActionIcon from "@/assets/icons/skoll/rank-2.svg";
import { Id, generateId } from "@/lib/dnd/id";

const IconMap: {
  [key in CampaignEventType]: { alt: string; icon: any };
} = {
  "character-start": { icon: defaultIcon, alt: "Character start" },
  "character-end": { icon: defaultIcon, alt: "Character end" },
  "character-movement": { icon: moveIcon, alt: "Movement" },
  "character-primary-action": {
    icon: primaryActionIcon,
    alt: "Primary action",
  },
  "character-secondary-action": {
    icon: secondaryActionIcon,
    alt: "Secondary action",
  },
  "battle-new-round": { icon: newRoundIcon, alt: "New round" },
};

const EventIconSize = 32;

export default function Battle() {
  const [campaign, setCampaign] = useState<Campaign>({
    characters: [],
    events: [],
    battles: [
      {
        id: generateId(),
        characters: [],
        rounds: [{ id: "round-1" }],
      },
    ],
  });

  function addCharacter(isPlayer: boolean) {
    const id = generateId();

    setCampaign(
      addCharacterToCurrentBattle(
        ...addRandomCharacterToCampaign(campaign, isPlayer, id)
      )
    );
  }

  function renderCharacter(
    battleChar: BattleCharacter,
    currentRound: Round,
    characterToAct: BattleCharacter
  ) {
    const { characterId } = battleChar;
    const character = getCharacter(campaign, characterId);
    const hasSpentAction = characterHasRoundEvent(
      campaign,
      currentRound,
      characterId,
      CampaignEventType.CharacterPrimaryAction
    );

    const hasSpentBonus = characterHasRoundEvent(
      campaign,
      currentRound,
      characterId,
      CampaignEventType.CharacterBonusAction
    );

    const hasFinished = characterHasRoundEvent(
      campaign,
      currentRound,
      characterId,
      CampaignEventType.CharacterEndRound
    );

    const currentCharacterAction =
      battleChar.characterId ===
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
        <div>
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
              <div>{battleChar.initiative} initiative</div>
              <div>
                Level {character.characterClasses[0].level}{" "}
                {character.characterClasses[0].clazz}
              </div>
            </div>

            {currentCharacterAction && (
              <div className="flex gap-x-2">
                <button
                  disabled={hasSpentAction || hasFinished}
                  onClick={() =>
                    setCampaign({
                      ...characterPerformBattleAction(
                        campaign,
                        ActionType.Attack,
                        CampaignEventType.CharacterPrimaryAction,
                        character.id
                      ),
                    })
                  }
                  className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
                >
                  Action
                </button>

                <button
                  disabled={hasSpentBonus || hasFinished}
                  onClick={() =>
                    setCampaign({
                      ...characterPerformBattleAction(
                        campaign,
                        ActionType.Attack,
                        CampaignEventType.CharacterBonusAction,
                        character.id
                      ),
                    })
                  }
                  className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
                >
                  Bonus action
                </button>

                <button
                  disabled={hasFinished}
                  onClick={() =>
                    setCampaign({
                      ...characterPerformBattleAction(
                        campaign,
                        ActionType.None,
                        CampaignEventType.CharacterEndRound,
                        character.id
                      ),
                    })
                  }
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
    const battle = getCurrentBattle(campaign);
    const battleEvents = getBattleEvents(campaign, battle);

    return (
      <div className="w-full gap-2 mb-4">
        {battleEvents.map(renderBattleEvent)}
      </div>
    );
  }

  function renderBattleEvent(event: CampaignEvent) {
    const eventIcon = IconMap[event.eventType];

    return (
      <div key={event.id} className="flex border border-slate-500 p-2">
        <Image
          className="invert"
          width={EventIconSize}
          height={EventIconSize}
          alt={eventIcon.alt}
          src={eventIcon.icon}
        />
        {event.actionType}
      </div>
    );
  }

  const currentCharacter = currentCharacterTurn(campaign);
  const canEndTurn = currentRoundCanEnd(campaign);
  const currentRound = getCurrentBattleRound(campaign);
  const battle = getCurrentBattle(campaign);

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
      <div className="w-full flex gap-2">
        <div className="w-3/4">
          <div className="flex flex-col w-full gap-y-4 mb-4">
            {battle.characters
              .sort((a, b) => b.initiative - a.initiative)
              .map((battleChar) =>
                renderCharacter(battleChar, currentRound, currentCharacter)
              )}
          </div>

          <button
            className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
            disabled={!canEndTurn}
            onClick={() =>
              setCampaign((old) => {
                const newRound = getCurrentBattleNextRound(old);
                return newRound;
              })
            }
          >
            Next round
          </button>
        </div>

        <div className="w-1/4">{renderBattleEvents()}</div>
      </div>
    </div>
  );
}
