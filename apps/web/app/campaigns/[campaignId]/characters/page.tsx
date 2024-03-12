import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H3 } from "@/components/ui/typography";

export default async function CampaignCharactersPage() {
  return (
    <>
      <H3>Characters</H3>
      <Separator className="my-3" />

      <div className="flex gap-2 my-2">
        <Button variant="outline">Add player character</Button>
        <Button variant="outline">Invite a friend</Button>
      </div>
    </>
  );
}
