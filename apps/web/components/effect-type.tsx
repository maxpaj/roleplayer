import { CharacterEventType } from "roleplayer";
import { Muted } from "./ui/typography";

export function EffectType({ type }: { type: CharacterEventType["type"] }) {
  switch (type) {
    case "CharacterResourceLoss":
      return "Resource Loss";
    case "CharacterStatusGain":
      return "Status";
  }

  return <Muted>{type}</Muted>;
}
