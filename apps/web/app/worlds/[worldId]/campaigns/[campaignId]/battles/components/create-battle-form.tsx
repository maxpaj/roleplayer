import { redirect } from "next/navigation";
import { memoryWorldRepository } from "../../../../../../../storage/world-repository";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H2 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

const validateBattleFormSchema = z.object({
  name: z.string().min(1),
});

type CreateBattleFormProps = {
  worldId: string;
};

export function CreateBattleForm({ worldId }: CreateBattleFormProps) {
  async function createNewBattle(formData: FormData) {
    "use server";

    const battleInput = Object.fromEntries(formData.entries());

    const validationResult = validateBattleFormSchema.safeParse(battleInput);
    if (!validationResult.success) {
      throw new Error("Battle 'name' missing");
    }

    const battleId = await memoryWorldRepository.createBattle(worldId);

    return redirect(`/worlds/${worldId}/battles/${battleId}`);
  }

  return (
    <>
      <H2>New battle form</H2>
      <Separator />

      <form action={createNewBattle}>
        <Input
          type="name"
          id="name"
          name="name"
          placeholder="New Battle name"
        />

        <Button type="submit">Create new Battle</Button>
      </form>
    </>
  );
}
