import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Actor } from "roleplayer";

type ActorActionEligibleTargetsProps = {
  characters: Actor[];
  disabled?: boolean;
  onSelectedCharacter: (targets: Actor[]) => void;
  placeholder?: string;
};

export function CharacterSelector({
  placeholder,
  characters,
  onSelectedCharacter,
  disabled = false,
}: ActorActionEligibleTargetsProps) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(targetId) => {
        const target = characters.find((t) => t.id === targetId);
        if (!target) {
          throw new Error("Target not found");
        }
        onSelectedCharacter([target]);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder || "Select character"} />
      </SelectTrigger>

      <SelectContent>
        {characters.map((target) => (
          <SelectItem key={target.id} value={target.id}>
            {target.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
