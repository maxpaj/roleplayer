import { CharacterResourceTypesIconMap, defaultIcon } from "app/theme";
import Image from "next/image";
import { CharacterResource, CharacterResourceDefinition } from "roleplayer";

type ResourceIndicatorProps = {
  resource: CharacterResource;
  resourceType: CharacterResourceDefinition;
};

export function ResourceIndicator({ resource, resourceType }: ResourceIndicatorProps) {
  function renderResourceIcon(resourceType: CharacterResourceDefinition) {
    const icon = CharacterResourceTypesIconMap[resourceType.name];
    if (!icon) {
      return <Image src={defaultIcon} alt={resourceType.name} width={12} height={12} className="dark:invert" />;
    }

    return <Image src={icon.icon} alt={resourceType.name} width={12} height={12} className="dark:invert" />;
  }

  return (
    <div className="flex gap-2 border p-2">
      {renderResourceIcon(resourceType)}
      <span>
        {resource.amount}/{resource.max}
      </span>
    </div>
  );
}
