import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldService } from "services/world-service";
import { WorldRecord } from "@/db/schema/worlds";

const validateName = z.object({
  name: z.string().min(1),
});

export async function CreateMonsterForm({ worldId }: { worldId: WorldRecord["id"] }) {
  async function createMonster(formData: FormData) {
    "use server";

    const monsterInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(monsterInput);
    if (!validationResult.success) {
      throw new Error("World name missing");
    }

    const stored = await new WorldService().createMonster({
      name: monsterInput.name!.toString(),
      worldId,
    });

    return redirect(`/worlds/${worldId}/monsters/${stored[0]!.id}`);
  }

  return (
    <form className="flex items-start gap-2" action={createMonster}>
      <Input type="name" id="name" name="name" placeholder="New monster name" />
      <Button type="submit">Create monster</Button>
    </form>
  );
}
