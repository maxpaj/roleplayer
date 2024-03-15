"use client";

import { Input } from "@/components/ui/input";
import { Character, World } from "roleplayer";
import { CharacterStat } from "roleplayer";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";

type CharacterStatsEditorProps = {
  character: RemoveFunctions<Character>;
  world: RemoveFunctions<World>;
  onChange: (stats: CharacterStat[]) => void;
};

export function CharacterStatsEditor({
  world,
  character,
  onChange,
}: CharacterStatsEditorProps) {
  const [stats, setStats] = useState<CharacterStat[]>(character.stats);

  return (
    <>
      {stats
        .map((s) => ({
          statType: world.ruleset.characterStatTypes.find(
            (st) => st.id === s.statId
          ),
          characterStat: s,
        }))
        .sort((a, b) => (a.statType!.name > b.statType!.name ? 1 : -1))
        .map((s) => {
          if (!s.statType) {
            throw new Error("No such stat type");
          }

          return (
            <div key={s.characterStat.statId}>
              <h2>{s.statType.name}</h2>
              <Input
                type="number"
                id={s.statType.name}
                name={s.statType.name}
                placeholder={s.statType.name}
                value={s.characterStat.amount}
                onChange={(e) => {
                  const n = e.target.value ? e.target.value : 0;
                  const newStats = [
                    ...stats.filter((p) => p.statId !== s.statType!.id),
                    {
                      amount: n,
                      statId: s.statType!.id,
                    },
                  ];

                  setStats(newStats);
                  onChange(newStats);
                }}
              />
            </div>
          );
        })}
    </>
  );
}
