import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionDefinition, Actor, Campaign } from "roleplayer";

type ActorActionEligibleTargetsProps = {
  campaign: Campaign;
  actor: Actor;
  action: ActionDefinition;
  onSelectedTargets: (targets: Actor[]) => void;
};

export function ActorActionEligibleTargets({
  campaign,
  actor,
  action,
  onSelectedTargets,
}: ActorActionEligibleTargetsProps) {
  const targets = campaign.getCharacterEligibleTargets(actor, action);

  return (
    <Select
      disabled={!action}
      onValueChange={(targetId) => {
        const target = targets.find((t) => t.id === targetId);
        if (!target) {
          throw new Error("Target not found");
        }
        onSelectedTargets([target]);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select target" />
      </SelectTrigger>

      <SelectContent>
        {targets.map((target) => (
          <SelectItem key={target.id} value={target.id}>
            {target.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
