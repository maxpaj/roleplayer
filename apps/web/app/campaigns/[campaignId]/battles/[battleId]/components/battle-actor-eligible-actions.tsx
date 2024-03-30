import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionDefinition, Actor } from "roleplayer";

type ActorEligibleActionsProps = {
  actor: Actor;
  onSelectedAction: (action: ActionDefinition) => void;
};

export function ActorEligibleActions({ actor, onSelectedAction }: ActorEligibleActionsProps) {
  const actions = actor.getAvailableActions();
  const hasActions = actions.length > 0;

  return (
    <Select
      onValueChange={(actionId) => {
        const action = actions.find((a) => a.id === actionId);
        if (!action) {
          throw new Error("Action not found");
        }

        onSelectedAction(action);
      }}
      disabled={!hasActions}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select action" />
      </SelectTrigger>

      <SelectContent>
        {actions.map((action) => {
          const hasActionsResources = action.requiresResources.every((res) => {
            const characterResource = actor.resources.find((r) => r.resourceTypeId === res.resourceTypeId);
            if (!characterResource) {
              throw new Error("Cannot find character resource");
            }

            return characterResource.amount >= res.amount;
          });

          return (
            <SelectItem disabled={!hasActionsResources} key={action.name} value={action.id}>
              {action.name} {!hasActionsResources && "(Not enough resources)"} (
              {action.requiresResources.map((res) => res.resourceTypeId).join(", ")})
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
