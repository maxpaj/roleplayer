import { Interaction } from "@repo/rp-lib";

type AbilityCardProps = {
  ability: Interaction;
};

export function AbilityCard({ ability }: AbilityCardProps) {
  return <>{ability.name}</>;
}
