import { memoryWorldRepository } from "../../../storage/world-repository";
import z from "zod";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const validateWorldFormSchema = z.object({
  name: z.string().min(1),
});

export async function CreateWorldForm() {
  async function createWorld(formData: FormData) {
    "use server";

    const worldInput = Object.fromEntries(formData.entries());

    const validationResult = validateWorldFormSchema.safeParse(worldInput);
    if (!validationResult.success) {
      throw new Error("World name missing");
    }

    const stored = await memoryWorldRepository.createWorld(
      validationResult.data.name
    );

    return redirect(`/worlds/${stored.id}`);
  }

  return (
    <form className="flex flex-col items-start gap-y-2" action={createWorld}>
      <Input type="name" id="name" name="name" placeholder="New world name" />
      <Button type="submit">Create world</Button>
    </form>
  );
}
