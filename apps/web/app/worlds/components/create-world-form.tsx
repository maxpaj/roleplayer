import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { WorldRepository } from "@/db/repository/drizzle-world-repository";

const validateName = z.object({
  name: z.string().min(1),
});

async function getTemplateWorlds() {
  return new WorldRepository().getTemplateWorlds();
}

async function createWorld(formData: FormData) {
  "use server";

  const worldInput = Object.fromEntries(formData.entries());

  const validationResult = validateName.safeParse(worldInput);
  if (!validationResult.success) {
    throw new Error("World name missing");
  }

  const stored = await new WorldRepository().createWorld({
    name: worldInput.name!.toString(),
    isTemplate: false,
    isPublic: false,
  });

  return redirect(`/worlds/${stored.id}`);
}

export async function CreateWorldForm() {
  const templates = await getTemplateWorlds();

  return (
    <form className="flex items-start gap-x-2" action={createWorld}>
      <Input type="name" id="name" name="name" placeholder="New world name" />
      <Combobox
        options={templates.map((t) => ({
          label: t.name,
          value: t.id.toString(),
        }))}
        placeholder="Use template"
      />
      <Button type="submit">Create world</Button>
    </form>
  );
}
