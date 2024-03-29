import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionDefinition } from "roleplayer";

type CharacterActionCardProps = {
  action: ActionDefinition;
};

export function CharacterActionCard({ action }: CharacterActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={"text-md"}>{action.name}</CardTitle>
        <CardDescription>{action.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
