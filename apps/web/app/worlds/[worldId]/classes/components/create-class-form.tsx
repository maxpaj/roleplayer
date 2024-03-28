import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldRecord } from "@/db/schema/worlds";
import { redirect } from "next/navigation";
import { WorldService } from "services/world-service";
import z from "zod";

const validateName = z.object({
  name: z.string().min(1),
});

export function CreateClassForm({ worldId }: { worldId: WorldRecord["id"] }) {
  async function createClass(formData: FormData) {
    "use server";

    const classInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(classInput);
    if (!validationResult.success) {
      throw new Error("Character 'name' missing");
    }

    const stored = await new WorldService().createCharacterClass({
      name: formData.get("name") as string,
      worldId: worldId,
    });

    return redirect(`/worlds/${worldId}/classes/${stored[0]!.id}`);
  }

  return (
    <form action={createClass} className="flex gap-2">
      <Input type="name" id="name" name="name" placeholder="New class name" />
      <Button type="submit">Create class</Button>
    </form>
  );
}
