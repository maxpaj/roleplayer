import { Actor, CharacterResourceDefinition, World } from "roleplayer";

type CharacterResourcesProps = { resourceTypes: CharacterResourceDefinition[]; character: Actor };

export function CharacterResources({ resourceTypes, character }: CharacterResourcesProps) {
  return (
    <div>
      {character.resources.map((r) => {
        const resource = resourceTypes.find((rt) => rt.id === r.resourceTypeId);
        if (!resource) {
          throw new Error("Cannot find resource type");
        }

        const generation = character.getResourceGeneration().find((r) => r.resourceTypeId);

        return (
          <div key={r.resourceTypeId}>
            {resource.name} {r.amount}/{r.max} {generation && <>+{generation.amount}</>}
          </div>
        );
      })}
    </div>
  );
}
