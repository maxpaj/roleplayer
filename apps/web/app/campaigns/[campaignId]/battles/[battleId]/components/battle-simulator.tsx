"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Battle,
  BattleCharacter,
  Round,
  World,
  CampaignEvent,
} from "@repo/rp-lib";
import { D20, roll } from "@repo/rp-lib";
import { ItemSlot, ItemType, Rarity } from "@repo/rp-lib";
import { Interaction } from "@repo/rp-lib";
import { Campaign } from "@repo/rp-lib";
import { Id, generateId } from "@repo/rp-lib";
import { EventIconMap } from "../../../../../theme";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";

const EventIconSize = 32;

export function BattleSimulator({}) {
  const world = new World({
    name: "World",
    items: [
      {
        id: generateId(),
        actions: [],
        occupiesSlots: [ItemSlot.MainHand],
        name: "Short sword",
        type: ItemType.Equipment,
        rarity: Rarity.Common,
        description: "",
        imageUrl: "",
      },
    ],
  });

  const [campaign, setCampaignReact] = useState<Campaign>(
    new Campaign({
      name: "Campaign",
      world: world,
    })
  );

  const [, updateState] = useState({});
  const [selectedAction, setSelectedAction] = useState<Interaction | undefined>(
    undefined
  );
  const forceUpdate = useCallback(() => updateState({}), []);

  function addCharacter(isPlayer: boolean) {
    const characterId = generateId();
    campaign.createCharacter(characterId, "Character A");
    campaign.addCharacterToCurrentBattle(characterId);
    setCampaign(campaign);
  }

  function setCampaign(campaign: Campaign) {
    setCampaignReact(campaign);
    forceUpdate();
  }

  function characterAttack(
    attackerId: Id,
    defenderIds: Id[],
    action: Interaction
  ) {
    const attacker = campaign.getCharacter(attackerId);

    if (!attacker.actions.length) {
      throw new Error("Has no attacks");
    }

    const defenders = defenderIds.map((defenderId) =>
      campaign.getCharacter(defenderId)
    );

    const attack = attacker
      .getAvailableActions()
      .find((a) => a.id === action.id);
    if (!attack) {
      throw new Error("Cannot find attack");
    }

    defenders.forEach((defender) => {
      return campaign.performCharacterAttack(
        attacker,
        roll(D20),
        attack,
        defender
      );
    });

    setCampaign(campaign);
  }

  function renderCharacter(
    battle: Battle,
    battleCharacter: BattleCharacter,
    currentRound: Round,
    characterToAct?: BattleCharacter
  ) {
    const { characterId } = battleCharacter;
    const c = campaign.applyEvents();
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
              <div>Level {campaign.getCharacterLevel(character)}</div>
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
                    campaign.endCharacterTurn(character);
                    setCampaign(campaign);
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
    const battleEvents = campaign.getCurrentBattleEvents();

    return (
      <div className="w-full gap-2 mb-4 flex flex-col">
        {battleEvents.filter(isVisibleEvent).map(renderBattleEvent)}
      </div>
    );
  }

  function isVisibleEvent(event: CampaignEvent) {
    const excludedActions = ["RoundStarted"];
    return !excludedActions.includes(event.type);
  }

  function nextRound() {
    campaign.nextRound();
    setCampaign(campaign);
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

  const battle = campaign.getCurrentBattle();
  if (battle === undefined) {
    return <>No active battle</>;
  }

  const currentRound = campaign.getCurrentRound();
  if (currentRound === undefined) {
    return <>No active round</>;
  }

  const battleEvents = campaign.getCurrentBattleEvents();
  const roundEvents = battleEvents.filter((e) => e.roundId === currentRound.id);
  const currentCharacter = battle.currentCharacterTurn(roundEvents);
  const campaignState = campaign.applyEvents();
  const canEndTurn = campaignState.allCharactersHaveActed(battleEvents);

  return (
    <div className="w-full">
      <div className="flex mb-4 justify-between">
        <div className="flex gap-x-2">
          <Button onClick={() => addCharacter(true)}>Add character</Button>
          <Button onClick={() => addCharacter(false)}>Add monster</Button>
        </div>
      </div>

      <h1 className="text-xl mb-4">Round {campaignState.rounds.length}</h1>
      <div className="w-full flex gap-4">
        <div className="w-3/4">
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

          <Button
            disabled={!canEndTurn}
            onClick={() => {
              nextRound();
            }}
          >
            Next round
          </Button>
        </div>

        <div className="w-1/4">
          <H2>Events ({campaign.events.length})</H2>
          {renderBattleEvents()}
        </div>
      </div>
    </div>
  );
}
