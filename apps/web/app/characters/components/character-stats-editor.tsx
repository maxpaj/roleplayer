"use client";

import { Input } from "@/components/ui/input";
import { Actor, World } from "roleplayer";
import { CharacterStat } from "roleplayer";
import { useState } from "react";
import { RemoveFunctions } from "types/without-functions";
import { H5 } from "@/components/ui/typography";

type CharacterStatsEditorProps = {
  character: RemoveFunctions<Actor>;
  world: RemoveFunctions<World>;
  onChange: (stats: CharacterStat[]) => void;
};

export function CharacterStatsEditor({ world, character, onChange }: CharacterStatsEditorProps) {
  const [stats, setStats] = useState<CharacterStat[]>(character.stats);

  return (
    <>
      {stats
        .map((s) => ({
          statType: world.ruleset.getCharacterStatTypes().find((st) => st.id === s.statId),
          characterStat: s,
        }))
        .sort((a, b) => (a.statType!.name > b.statType!.name ? 1 : -1))
        .map((s) => {
          if (!s.statType) {
            throw new Error("No such stat type");
          }

          return (
            <div key={s.characterStat.statId}>
              <H5>{s.statType.name}</H5>
              <Input
                type="number"
                id={s.statType.name}
                name={s.statType.name}
                placeholder={s.statType.name}
                value={s.characterStat.amount}
                onChange={(e) => {
                  const n = e.target.value ? parseInt(e.target.value) : 0;
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
