import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldRepository } from "@/db/repository/drizzle-world-repository";
import { WorldRecord } from "@/db/schema/worlds";

const validateName = z.object({
  name: z.string().min(1),
});

export async function CreateItemForm({
  worldId,
}: {
  worldId: WorldRecord["id"];
}) {
  async function createItem(formData: FormData) {
    "use server";

    const itemInput = Object.fromEntries(formData.entries());

    const validationResult = validateName.safeParse(itemInput);
    if (!validationResult.success) {
      throw new Error("Item name missing");
    }

    const stored = await new WorldRepository().createItem({
      name: itemInput.name!.toString(),
      worldId,
    });

    return redirect(`/worlds/${worldId}/items/${stored[0]!.id}`);
  }

  return (
    <form className="flex items-start gap-x-2" action={createItem}>
      <Input type="name" id="name" name="name" placeholder="New item name" />
      <Button type="submit">Create item</Button>
    </form>
  );
}
