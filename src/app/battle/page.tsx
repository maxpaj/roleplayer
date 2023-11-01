"use client";

import { useState } from "react";
import { Alignment, Clazz, Race } from "@/lib/dnd/character/character";
import {
  Battle,
  BattleAction,
  BattleCharacter,
  BattleCharacterAction,
  BattleRound,
  characterHasSpentAction,
} from "@/lib/dnd/battle/battle";
import { getCharacterInitiative } from "@/lib/dnd/character/character-stats";
import {
  characterAttack,
  currentCharacterTurn,
  hasRolledForInitiative,
} from "@/lib/dnd/battle/battle";

export default function Battle() {
  const [battle, setBattle] = useState<Battle>({
    characters: [],
    rounds: [
      {
        characterActions: [],
      },
    ],
  });

  function performAttack(battle: Battle, character: BattleCharacter) {
    const b = characterAttack(battle, character.character.id);
    setBattle((old) => ({
      characters: old.characters,
      rounds: [...b.rounds],
    }));
  }

  function renderCharacter(
    battleChar: BattleCharacter,
    currentRound: BattleRound,
    currentCharacterTurn: BattleCharacter
  ) {
    const { character } = battleChar;
    const npcClass = !character.isPlayerControlled
      ? "border-rose-400"
      : "border-blue-400";

    const hasSpentAction = characterHasSpentAction(battle, character);

    const currentAction =
      battleChar.character.id ===
      (currentCharacterTurn ? currentCharacterTurn.character.id : undefined);

    const currentActionClass = currentAction
      ? "shadow-[0_0px_35px_0px_rgba(0,0,0,0.3)] shadow-red-600"
      : "";

    return (
      <div
        key={character.id}
        className={`flex justify-between border w-full p-4 shadow-md ${
          npcClass || ""
        } ${currentActionClass || ""}`}
      >
        <div>
          <div>{character.name}</div>
          <div>{character.race}</div>
          <div>{battleChar.initiative}</div>
          <div>
            Level {character.characterClasses[0].level}{" "}
            {character.characterClasses[0].clazz}
          </div>
        </div>
        <div>
          <button
            disabled={hasSpentAction}
            onClick={() => performAttack(battle, battleChar)}
            className="border disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-500 border-white p-3 rounded hover:bg-slate-500"
          >
            Attack
          </button>
        </div>
      </div>
    );
  }

  function renderAction(action: BattleCharacterAction) {
    return <div key={action.characterId}>{action.action.type}</div>;
  }

  function addCharacter(isPlayerControlled: boolean) {
    setBattle((battle) => {
      const b: Battle = {
        ...battle,
        characters: [
          ...battle.characters,
          {
            character: {
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
      <div className="flex gap-x-2 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => addCharacter(true)}
        >
          Add character
        </button>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => addCharacter(false)}
        >
          Add monster
        </button>

        <button
          disabled={hasRolledForInitiative(battle)}
          className="bg-green-500 disabled:bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => initiativeRoll()}
        >
          Roll initiative
        </button>
      </div>

      <h1 className="text-xl mb-4">Round {battle.rounds.length}</h1>
      <div className="flex w-full gap-x-4 mb-4">
        {battle.rounds[battle.rounds.length - 1].characterActions.map(
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
