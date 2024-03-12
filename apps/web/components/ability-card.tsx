import { Interaction } from "roleplayer";
import { Card } from "./ui/card";
import { ClassLevelProgression } from "roleplayer";
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
