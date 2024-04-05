import { EffectRecord } from "@/db/schema/effects";
import { DnDRuleset } from "roleplayer";
import { WorldAggregated } from "services/data-mapper";
import { EffectParameters } from "./effect-parameters";
import { EffectType } from "./effect-type";
import { H5 } from "./ui/typography";

export function EffectDetails({ effect, world }: { effect: EffectRecord; world: WorldAggregated }) {
  const params = effect.parameters as { parameters: Record<string, any> };
  const ruleset = new DnDRuleset(() => 2);

  return (
    <div>
      <H5>{effect.name}</H5>
      <EffectType type={effect.type} />
      <EffectParameters
        resourceDefinitions={ruleset.getCharacterResourceTypes()}
        parameters={params}
        statusDefinitions={world.statuses}
      />
    </div>
  );
}
