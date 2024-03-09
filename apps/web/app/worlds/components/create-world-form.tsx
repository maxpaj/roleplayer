import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { jsonWorldRepository } from "db/json/json-world-repository";

const validateWorldFormSchema = z.object({
  name: z.string().min(1),
});

async function getTemplateWorlds() {
  return jsonWorldRepository.getTemplateWorlds();
}

export async function CreateWorldForm() {
  async function createWorld(formData: FormData) {
    "use server";

    const worldInput = Object.fromEntries(formData.entries());

    const validationResult = validateWorldFormSchema.safeParse(worldInput);
    if (!validationResult.success) {
      throw new Error("World name missing");
    }

    const stored = await jsonWorldRepository.createWorld(
      validationResult.data.name
    );

    return redirect(`/worlds/${stored.id}`);
  }

  const templates = await getTemplateWorlds();

  return (
    <form className="flex items-start gap-x-2" action={createWorld}>
      <Input type="name" id="name" name="name" placeholder="New world name" />
      <Combobox
        options={templates.map((t) => ({
          label: t.name,
          value: t.id,
        }))}
        placeholder="Use template"
      />
      <Button type="submit">Create world</Button>
    </form>
  );
}
