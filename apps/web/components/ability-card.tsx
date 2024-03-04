import { Interaction } from "@repo/rp-lib";
import { Card } from "./ui/card";
import { ClassLevelProgression } from "@repo/rp-lib/character";
import { H3 } from "./ui/typography";

type AbilityCardProps = {
  ability: Interaction;
  levelProgression: ClassLevelProgression;
};

export function AbilityCard({ ability, levelProgression }: AbilityCardProps) {
  return (
    <Card>
      <H3>{ability.name}</H3>
      <span>Unlocks at level {levelProgression.unlockedAtLevel}</span>
    </Card>
  );
}
