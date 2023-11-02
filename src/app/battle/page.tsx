"use client";

import { useState } from "react";
import { Alignment, Clazz, Race } from "@/lib/dnd/character/character";
import {
  Battle,
  BattleCharacter,
  BattleEvent,
  BattleRound,
  characterFinished,
  characterHasFinishedRound,
  characterHasSpentBonusAction,
  characterHasSpentPrimaryAction,
  characterPerformBonus,
  getRoundEvents,
} from "@/lib/dnd/battle/battle";
import { getCharacterInitiative } from "@/lib/dnd/character/character-stats";
import {
  characterPerformAttack,
  currentCharacterTurn,
  hasRolledForInitiative,
} from "@/lib/dnd/battle/battle";

export default function Battle() {
  const [battle, setBattle] = useState<Battle>({
    characters: [],
    events: [],
    rounds: [{ id: "round-1" }],
  });

  function performBonus(battle: Battle, character: BattleCharacter) {
    const b = characterPerformBonus(battle, character.character.id);
    setBattle((old) => ({
      characters: old.characters,
      rounds: [...b.rounds],
      events: [...b.events],
    }));
  }

  function finishRound(battle: Battle, character: BattleCharacter) {
    const b = characterFinished(battle, character.character.id);
    setBattle((old) => ({
      characters: old.characters,
      rounds: [...b.rounds],
      events: [...b.events],
    }));
  }

  function performAttack(battle: Battle, character: BattleCharacter) {
    const b = characterPerformAttack(battle, character.character.id);
    setBattle((old) => ({
      characters: old.characters,
      rounds: [...b.rounds],
      events: [...b.events],
    }));
  }

  function renderCharacter(
    battleChar: BattleCharacter,
    currentRound: BattleRound,
    currentCharacterTurn: BattleCharacter
  ) {
    const { character } = battleChar;
    const hasSpentAction = characterHasSpentPrimaryAction(battle, character);
    const hasSpentBonus = characterHasSpentBonusAction(battle, character);
    const hasFinished = characterHasFinishedRound(battle, character);

    const currentAction =
      battleChar.character.id ===
      (currentCharacterTurn ? currentCharacterTurn.character.id : undefined);

    const currentActionClass = currentAction
      ? "shadow-[0_0px_40px_0px_rgba(0,0,0,0.3)] shadow-red-600"
      : "";

    return (
      <div
        key={character.id}
        className={`flex justify-between border border-slate-700 w-full overflow-hidden shadow-md relative ${
          currentActionClass || ""
        }`}
      >
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
            <div>{battleChar.initiative}</div>
            <div>
              Level {character.characterClasses[0].level}{" "}
              {character.characterClasses[0].clazz}
            </div>
          </div>

          <div className="flex gap-x-2">
            <button
              disabled={hasSpentAction || hasFinished}
              onClick={() => performAttack(battle, battleChar)}
              className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
            >
              Action
            </button>

            <button
              disabled={hasSpentBonus || hasFinished}
              onClick={() => performBonus(battle, battleChar)}
              className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
            >
              Bonus action
            </button>

            <button
              disabled={hasFinished}
              onClick={() => finishRound(battle, battleChar)}
              className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
            >
              End
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderAction(event: BattleEvent) {
    return (
      <div key={event.characterId}>
        {event.eventType} {event.actionType}
      </div>
    );
  }

  function addCharacter(isPlayerControlled: boolean) {
    setBattle((battle) => {
      const b: Battle = {
        ...battle,
        characters: [
          ...battle.characters,
          {
            character: {
              imageUrl: "/character.png",
              id: Date.now().toString(),
              isPlayerControlled: isPlayerControlled,
              name: isPlayerControlled ? "New character" : "Monster",
              party: "",
              background: "",
              faction: "",
              playerName: "",
              race: Race.Dwarf,
              alignment: Alignment.Evil,
              characterClasses: [
                {
                  clazz: Clazz.Bard,
                  level: 1,
                },
              ],
              attacks: [],
              cantrips: [],
              statuses: [],
              spells: [],
              spellSlots: [],
              temporaryHealth: 0,
              currentHealth: 0,
              maximumHealth: 0,
              baseArmor: 0,
              baseCharisma: 0,
              baseConstitution: 0,
              baseDexterity: 0,
              baseIntelligence: 0,
              baseSpeed: 0,
              baseStrength: 0,
              baseWisdom: 0,
              xp: 0,
            },
            initiative: 0,
          },
        ],
      };

      return b;
    });
  }

  function initiativeRoll() {
    setBattle((battle) => {
      return {
        ...battle,
        characters: battle.characters.map((c) => {
          const initiative =
            c.initiative || getCharacterInitiative(c.character);

          return {
            ...c,
            initiative,
          };
        }),
      };
    });
  }

  const currentRound = battle.rounds.slice(-1)[0];
  const currentCharacter = currentCharacterTurn(battle);

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
        <div>
          <button
            disabled={hasRolledForInitiative(battle)}
            className="bg-green-500 disabled:bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => initiativeRoll()}
          >
            Roll initiative
          </button>
        </div>
      </div>

      <h1 className="text-xl mb-4">Round {battle.rounds.length}</h1>
      <div className="flex w-full gap-x-4 mb-4">
        {getRoundEvents(battle.rounds[battle.rounds.length - 1], battle).map(
          renderAction
        )}
      </div>

      <div className="flex flex-col w-full gap-y-4 mb-4">
        {battle.characters
          .sort((a, b) => b.initiative - a.initiative)
          .map((battleChar) =>
            renderCharacter(battleChar, currentRound, currentCharacter)
          )}
      </div>
    </div>
  );
}
