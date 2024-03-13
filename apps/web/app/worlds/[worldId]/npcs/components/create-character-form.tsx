import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldService } from "services/world-service";
import { WorldRecord } from "@/db/schema/worlds";

const validateName = z.object({
  name: z.string().min(1),
});

export async function CreateWorldCharacterForm({
  worldId,
}: {
  worldId: WorldRecord["id"];
}) {
  async function createWorldCharacter(formData: FormData) {
    "use server";

    const itemInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(itemInput);
    if (!validationResult.success) {
      throw new Error("WorldCharacter name missing");
    }

    const stored = await new WorldService().createWorldCharacter({
      name: itemInput.name!.toString(),
      worldId,
    });

    return redirect(`/worlds/${worldId}/characters/${stored[0]!.id}`);
  }

  return (
    <form className="flex items-start gap-x-2" action={createWorldCharacter}>
      <Input type="name" id="name" name="name" placeholder="New item name" />
      <Button type="submit">Create item</Button>
    </form>
  );
}
