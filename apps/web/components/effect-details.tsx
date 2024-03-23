import { EffectRecord } from "@/db/schema/effects";
import { DnDRuleset } from "roleplayer";
import { EffectParameters } from "./effect-parameters";
import { EffectType } from "./effect-type";
import { H5 } from "./ui/typography";

export function EffectDetails({ effect }: { effect: EffectRecord }) {
  const params = effect.parameters as { parameters: Record<string, any> };
  const ruleset = new DnDRuleset();

  return (
    <div>
      <H5>{effect.name}</H5>
      <EffectType type={effect.type} />
      <EffectParameters resourceDefinitions={ruleset.getCharacterResourceTypes()} parameters={params} />
    </div>
  );
}
